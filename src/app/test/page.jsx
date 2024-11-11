"use client";
import React, { useEffect, useState } from "react";
// import socket from "socket.io-client";

export default function Page() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const socket = new WebSocket("ws://192.168.35.114:8000/ws/somepath/");

    socket.onopen = () => {
      console.log("Connected to Django WebSocket server");
      socket.send(JSON.stringify({ message: "Hello from Next.js!" }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data.message);
    };

    socket.onclose = () => {
      console.log("Disconnected from Django WebSocket server");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return <div>Check the console for messages!</div>;
}
