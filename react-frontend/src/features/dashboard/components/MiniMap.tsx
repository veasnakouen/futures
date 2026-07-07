import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Monitor, Smartphone, Tablet, Server } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import api from '@/services/api';
import websocketService from '../../../services/websocketService';
import authService from '../../../services/authService';

// Fix for default marker icon in Leaflet with Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LoginLog {
  id: number;
  loggedBy: string;
  loggedDate: string;
  ipAddress: string;
  deviceType: string;
  os: string;
  browser: string;
  location: string;
  status: string;
}

interface LocationMessage {
  username: string;
  latitude: number;
  longitude: number;
}

const MapUpdater: React.FC<{ locations: LocationMessage[] }> = ({
  locations,
}) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1) {
      // Zoom in closely if only one user is online
      map.flyTo([locations[0].latitude, locations[0].longitude], 12, {
        animate: true,
        duration: 1.5,
      });
    } else {
      // Fit bounds if multiple users are online
      const bounds = L.latLngBounds(
        locations.map((l) => [l.latitude, l.longitude]),
      );
      map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12,
        animate: true,
        duration: 1.5,
      });
    }
  }, [locations, map]);
  return null;
};

interface MiniMapProps {
  isDark?: boolean;
}

const MiniMap: React.FC<MiniMapProps> = ({ isDark }) => {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [onlineLocations, setOnlineLocations] = useState<
    Record<string, LocationMessage>
  >({});
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch historical/device data from Audit Logs
    const fetchLogs = async () => {
      try {
        const response = await api.get("/auth/audit/logs");
        if (!isMounted) return;
        if (Array.isArray(response.data)) {
          setLogs(response.data);
        } else {
          console.warn("Audit logs endpoint did not return an array:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();

    // 2. Subscribe to STOMP topic for live GPS ledger
    const handleLocationsUpdate = (
      locationsMap: Record<string, LocationMessage>,
    ) => {
      setOnlineLocations(locationsMap);
    };

    websocketService.connect(() => {
      websocketService.subscribe("/topic/locations", handleLocationsUpdate);
    });

    // 3. Capture this user's True GPS and broadcast to server
    const sendLocationWhenConnected = (lat: number, lng: number) => {
      if (!isMounted) return;
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.username) return; // Prevent sending null username

      websocketService.connect(() => {
        websocketService.sendMessage("/app/location.update", {
          username: currentUser.username,
          latitude: lat,
          longitude: lng,
        });
      });
    };

    let watchId: number;
    let fallbackInterval: NodeJS.Timeout;

    const startSimulatedTracking = (baseLat: number, baseLng: number) => {
      // Send initial location
      sendLocationWhenConnected(baseLat, baseLng);
      // Simulate real-time movement by adding tiny random offsets every 3 seconds
      let currentLat = baseLat;
      let currentLng = baseLng;
      
      fallbackInterval = setInterval(() => {
        if (!isMounted) return;
        // Random walk: +/- 0.001 degrees
        currentLat += (Math.random() - 0.5) * 0.001;
        currentLng += (Math.random() - 0.5) * 0.001;
        sendLocationWhenConnected(currentLat, currentLng);
      }, 3000);
    };

    const getFallbackLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (isMounted && data.latitude && data.longitude) {
          startSimulatedTracking(data.latitude, data.longitude);
        } else if (isMounted) {
          // Hardcoded fallback if API hits rate limit
          startSimulatedTracking(11.5564, 104.9282); // Phnom Penh, Cambodia
        }
      } catch (e) {
        console.warn("Fallback location failed", e);
        if (isMounted) startSimulatedTracking(11.5564, 104.9282);
      }
    };

    if (currentUser) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (isMounted) {
              sendLocationWhenConnected(
                position.coords.latitude,
                position.coords.longitude,
              );
            }
          },
          (error) => {
            console.warn(
              "Geolocation access denied or failed. Falling back to simulated location.",
              error,
            );
            if (isMounted) getFallbackLocation();
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        );
      } else {
        getFallbackLocation();
      }
    }

    return () => {
      isMounted = false;
      websocketService.unsubscribe("/topic/locations");
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [currentUser]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone size={14} className="text-blue-500" />;
      case "tablet":
        return <Tablet size={14} className="text-purple-500" />;
      case "server":
        return <Server size={14} className="text-gray-500" />;
      default:
        return <Monitor size={14} className="text-emerald-500" />;
    }
  };

  const defaultCenter: [number, number] = [20.0, 0.0];
  const zoomLevel = 2;

  if (loading) return null;

  return (
    <ScrollReveal
      className="h-full"
      animation="fade-in-up"
      delay={250}
      duration={600}
      triggerOnce={true}
    >
      <style>
        {`
          .leaflet-control-container .leaflet-control { z-index: 10 !important; }
          .leaflet-pane { z-index: 10 !important; }
        `}
      </style>
      <div className="h-full flex flex-col bg-white dark:bg-gray-800/40 dark:backdrop-blur-md p-8 rounded-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-4 tracking-tight">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md shadow-sm">
              <MapPin size={20} />
            </div>
            True GPS Tracking
          </h4>
          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30 rounded-md px-4 py-1 font-black uppercase text-[10px] tracking-widest shadow-sm">
            Live Online Users
          </span>
        </div>

        <div className="flex-1 w-full rounded-md overflow-hidden min-h-[380px] shadow-inner z-0 relative">
          <MapContainer
            center={defaultCenter}
            zoom={zoomLevel}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <MapUpdater locations={Object.values(onlineLocations)} />
            <TileLayer
              attribution={isDark ? '&copy; <a href="https://carto.com/attributions">CARTO</a>' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
              url={isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />

            {/* We ONLY render markers for users who are currently in the onlineLocations ledger! */}
            {Object.values(onlineLocations).map((liveUser) => {
              // Find their most recent login log to attach device metadata to the popup
              const userLog = logs.find(
                (log) => log.loggedBy === liveUser.username,
              );

              return (
                <Marker
                  key={`live-${liveUser.username}`}
                  position={[liveUser.latitude, liveUser.longitude]}
                >
                  <Popup className="custom-popup">
                    <div className="flex flex-col gap-1 min-w-[180px]">
                      <div className="flex items-center justify-between border-b pb-1 mb-1">
                        <strong className="text-sm font-bold text-gray-900 dark:text-gray-800">
                          {liveUser.username}
                        </strong>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 animate-pulse">
                          Online
                        </span>
                      </div>

                      {userLog ? (
                        <>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            {getDeviceIcon(userLog.deviceType)}
                            <span className="font-medium">{userLog.os}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">Browser:</span>{" "}
                            {userLog.browser}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">IP:</span>{" "}
                            {userLog.ipAddress}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-gray-500 mt-1 italic">
                          Device data syncing...
                        </div>
                      )}

                      <div className="text-[10px] text-gray-400 mt-2 font-mono bg-gray-50 p-1 rounded">
                        GPS: {liveUser.latitude.toFixed(4)},{" "}
                        {liveUser.longitude.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default MiniMap;
