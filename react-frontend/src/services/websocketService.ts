import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import authService from "./authService";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  connect(onConnectCallback?: () => void) {
    if (this.client?.active) {
      if (this.client.connected && onConnectCallback) {
        onConnectCallback();
      } else if (onConnectCallback) {
        // If active but not yet connected, wait for it
        const originalOnConnect = this.client.onConnect;
        this.client.onConnect = (frame) => {
          if (originalOnConnect) originalOnConnect(frame);
          onConnectCallback();
        };
      }
      return;
    }

    const user = authService.getCurrentUser();
    const token = user?.token;

    this.client = new Client({
      webSocketFactory: () => new SockJS("/ws"),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.client.onConnect = (frame) => {
      console.log("Connected: " + frame);
      if (onConnectCallback) onConnectCallback();
    };

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    this.client.activate();
  }

  subscribe(topic: string, callback: (message: any) => void) {
    if (!this.client || !this.client.connected) {
      setTimeout(() => this.subscribe(topic, callback), 1000);
      return;
    }

    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
    }

    const sub = this.client.subscribe(topic, (message: IMessage) => {
      callback(JSON.parse(message.body));
    });
    this.subscriptions.set(topic, sub);
  }

  unsubscribe(topic: string) {
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  sendMessage(destination: string, body: any) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error("STOMP client not connected");
    }
  }

  isConnected() {
    return this.client?.connected || false;
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
  }
}

export default new WebSocketService();
