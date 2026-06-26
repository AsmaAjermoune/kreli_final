"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "@/lib/api";

const SOCKET_URL =
  getApiBaseUrl().replace("/api/v1", "");


let _socket: Socket | null = null;
let _token: string | null = null;

export function getSocket(token: string): Socket {
  if (!_socket || _token !== token) {
    if (_socket) {
      _socket.disconnect();
      _socket = null;
    }
    _token = token;
    _socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
    });
  }
  return _socket;
}

export function disconnectSocket(): void {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    socketRef.current = getSocket(token);

    return () => {
      
    };
  }, [token]);

  return socketRef.current;
}
