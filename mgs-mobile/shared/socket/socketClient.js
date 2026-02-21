import { io } from "socket.io-client";
import { Platform } from "react-native";

const defaultSocketUrl = Platform.OS === "android"
    ? "http://10.0.2.2:5000"
    : "http://localhost:5000";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace("/api", "") || defaultSocketUrl;

class SocketClient {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket) return;

        this.socket = io(SOCKET_URL, {
            transports: ["websocket"],
        });

        this.socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinRoom(roomName) {
        if (this.socket) {
            this.socket.emit("join-room", roomName);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

export const socketClient = new SocketClient();
