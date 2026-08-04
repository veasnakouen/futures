import { useState, useEffect } from "react";
import api from "@/services/api";

export function useUserSettingsSystem(
  activeTab: string,
  setLoading: (loading: boolean) => void,
  setSuccess: (msg: string | null) => void,
  setError: (msg: string | null) => void,
  appLogo: string | null,
  setAppLogo: (logo: string | null) => void
) {
  const [hrStaffIdFormat, setHrStaffIdFormat] = useState("EMP-{YYYY}-{SEQ}");
  const [khqrBakongId, setKhqrBakongId] = useState("");
  const [khqrMerchantName, setKhqrMerchantName] = useState("");
  const [maxImageUploadSize, setMaxImageUploadSize] = useState("1");
  const [enableDdosProtection, setEnableDdosProtection] = useState(false);
  const [maxRequestsPerMinute, setMaxRequestsPerMinute] = useState("60");
  const [cloudflareZoneId, setCloudflareZoneId] = useState("");
  const [cloudflareApiToken, setCloudflareApiToken] = useState("");
  const [redisHost, setRedisHost] = useState("");
  const [redisPort, setRedisPort] = useState("6379");

  // Infrastructure Scaling Settings
  const [enableLoadBalancing, setEnableLoadBalancing] = useState(false);
  const [loadBalancerType, setLoadBalancerType] = useState("NGINX");
  const [enableReverseProxy, setEnableReverseProxy] = useState(false);
  const [reverseProxyUrl, setReverseProxyUrl] = useState("");

  const [mapCoords, setMapCoords] = useState({
    lat: (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("officeLat") || "51.505",
    lng: (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }).getItem("officeLng") || "-0.09",
  });

  useEffect(() => {
    if (activeTab === "hr") {
      api
        .get("/settings/HR_STAFF_ID_FORMAT")
        .then((res) => setHrStaffIdFormat(res.data.value))
        .catch(() => console.log("Setting not found, using default"));
    }
    if (activeTab === "system") {
      api
        .get("/settings/MAX_IMAGE_UPLOAD_SIZE_MB")
        .then((res) => setMaxImageUploadSize(res.data.value))
        .catch(() => console.log("Setting not found, using default"));

      api
        .get("/settings/APP_LOGO")
        .then((res) => setAppLogo(res.data.value))
        .catch(() => console.log("Logo not found"));

      api
        .get("/settings/ENABLE_DDOS_PROTECTION")
        .then((res) => setEnableDdosProtection(res.data.value === "true"))
        .catch(() => setEnableDdosProtection(false));

      api
        .get("/settings/MAX_REQUESTS_PER_MINUTE")
        .then((res) => setMaxRequestsPerMinute(res.data.value))
        .catch(() => setMaxRequestsPerMinute("60"));

      api
        .get("/settings/CLOUDFLARE_ZONE_ID")
        .then((res) => setCloudflareZoneId(res.data.value))
        .catch(() => setCloudflareZoneId(""));

      api
        .get("/settings/CLOUDFLARE_API_TOKEN")
        .then((res) => setCloudflareApiToken(res.data.value))
        .catch(() => setCloudflareApiToken(""));

      api
        .get("/settings/GATEWAY_REDIS_HOST")
        .then((res) => setRedisHost(res.data.value))
        .catch(() => setRedisHost(""));

      api
        .get("/settings/GATEWAY_REDIS_PORT")
        .then((res) => setRedisPort(res.data.value))
        .catch(() => setRedisPort("6379"));

      api
        .get("/settings/ENABLE_LOAD_BALANCING")
        .then((res) => setEnableLoadBalancing(res.data.value === "true"))
        .catch(() => setEnableLoadBalancing(false));

      api
        .get("/settings/LOAD_BALANCER_TYPE")
        .then((res) => setLoadBalancerType(res.data.value))
        .catch(() => setLoadBalancerType("NGINX"));

      api
        .get("/settings/ENABLE_REVERSE_PROXY")
        .then((res) => setEnableReverseProxy(res.data.value === "true"))
        .catch(() => setEnableReverseProxy(false));

      api
        .get("/settings/REVERSE_PROXY_URL")
        .then((res) => setReverseProxyUrl(res.data.value))
        .catch(() => setReverseProxyUrl(""));
    }
    if (activeTab === "pos") {
      api
        .get("/settings/KHQR_BAKONG_ID")
        .then((res) => setKhqrBakongId(res.data.value))
        .catch(() => setKhqrBakongId(""));
      api
        .get("/settings/KHQR_MERCHANT_NAME")
        .then((res) => setKhqrMerchantName(res.data.value))
        .catch(() => setKhqrMerchantName(""));
    }
  }, [activeTab]);

  const handleSaveHrSettings = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/settings", {
        key: "HR_STAFF_ID_FORMAT",
        value: hrStaffIdFormat,
      });
      setSuccess("HR settings updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update HR settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemSettings = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/settings", {
        key: "MAX_IMAGE_UPLOAD_SIZE_MB",
        value: maxImageUploadSize,
      });
      await api.post("/settings", {
        key: "ENABLE_DDOS_PROTECTION",
        value: enableDdosProtection.toString(),
      });
      await api.post("/settings", {
        key: "MAX_REQUESTS_PER_MINUTE",
        value: maxRequestsPerMinute,
      });
      await api.post("/settings", {
        key: "CLOUDFLARE_ZONE_ID",
        value: cloudflareZoneId,
      });
      await api.post("/settings", {
        key: "CLOUDFLARE_API_TOKEN",
        value: cloudflareApiToken,
      });
      await api.post("/settings", {
        key: "GATEWAY_REDIS_HOST",
        value: redisHost,
      });
      await api.post("/settings", {
        key: "GATEWAY_REDIS_PORT",
        value: redisPort,
      });
      await api.post("/settings", {
        key: "ENABLE_LOAD_BALANCING",
        value: enableLoadBalancing.toString(),
      });
      await api.post("/settings", {
        key: "LOAD_BALANCER_TYPE",
        value: loadBalancerType,
      });
      await api.post("/settings", {
        key: "ENABLE_REVERSE_PROXY",
        value: enableReverseProxy.toString(),
      });
      await api.post("/settings", {
        key: "REVERSE_PROXY_URL",
        value: reverseProxyUrl,
      });
      if (appLogo) {
        await api.post("/settings", { key: "APP_LOGO", value: appLogo });
        window.dispatchEvent(new Event("appLogoChanged"));
      }
      setSuccess("System settings updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update System settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePosSettings = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/settings", {
        key: "KHQR_BAKONG_ID",
        value: khqrBakongId,
      });
      await api.post("/settings", {
        key: "KHQR_MERCHANT_NAME",
        value: khqrMerchantName,
      });
      setSuccess("POS settings updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update POS settings.");
    } finally {
      setLoading(false);
    }
  };

  return {
    hrStaffIdFormat,
    setHrStaffIdFormat,
    khqrBakongId,
    setKhqrBakongId,
    khqrMerchantName,
    setKhqrMerchantName,
    maxImageUploadSize,
    setMaxImageUploadSize,
    enableDdosProtection,
    setEnableDdosProtection,
    maxRequestsPerMinute,
    setMaxRequestsPerMinute,
    cloudflareZoneId,
    setCloudflareZoneId,
    cloudflareApiToken,
    setCloudflareApiToken,
    redisHost,
    setRedisHost,
    redisPort,
    setRedisPort,
    enableLoadBalancing,
    setEnableLoadBalancing,
    loadBalancerType,
    setLoadBalancerType,
    enableReverseProxy,
    setEnableReverseProxy,
    reverseProxyUrl,
    setReverseProxyUrl,
    mapCoords,
    setMapCoords,
    handleSaveHrSettings,
    handleSaveSystemSettings,
    handleSavePosSettings,
  };
}
