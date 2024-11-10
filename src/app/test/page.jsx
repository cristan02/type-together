"use client";
import React, { useEffect, useState } from "react";
import socket from "socket.io-client";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const io = socket("http://localhost:1337"); //Connecting to Socket.io backend
  const username = "testUser";

  useEffect(() => {
    io.emit("join", { username }, (error) => {
      if (error) return alert(error);
    });

    io.on("message", async (data, error) => {
      console.log("sadas ", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, [username]);

  const sendMessage = (message) => {
    if (message) {
      io.emit("sendMessage", { message, user: username }, (error) => {
        if (error) {
          alert(error);
        }
      });
      setMessage("");
    } else {
      alert("Message can't be empty");
    }
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleClick = () => {
    sendMessage(message);
  };

  return (
    <div className=" w-full h-full flex flex-col justify-center items-center">
      <div className="w-1/2 h-3/4 border border-gray-500 rounded-lg p-4">
        <div className="w-full h-5/6 border border-gray-500 rounded-lg p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col mb-2">
              <div className="text-sm font-bold">{msg.user}</div>
              <div className="text-sm">{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="w-full h-1/6 flex items-center justify-between">
          <input
            type="text"
            className="w-4/5 h-3/4 border border-gray-500 rounded-lg p-2"
            value={message}
            onChange={handleChange}
          />
          <button
            className="w-1/5 h-3/4 border border-gray-500 rounded-lg p-2"
            onClick={handleClick}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
