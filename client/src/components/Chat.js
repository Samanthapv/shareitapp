import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { getMessages, sendMessage } from "../services/requests";

export default function Chat({ sender, receiver, name, photo, close }) {
  let [messages, setMessages] = useState([]);
  let [input, setInput] = useState("");

  useEffect(() => {
    setMessages([]);
    fetchData();

    Pusher.logToConsole = true;

    var pusher = new Pusher("2985b7ef897701726d64", {
      cluster: "eu",
      forceTLS: true,
    });

    const ids = [sender, receiver].sort();
    const channelName = `chat-${ids[0]}-${ids[1]}`;

    var channel = pusher.subscribe(channelName);
    channel.bind("message", function (data) {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [receiver, sender]);

  const send = async () => {
    try {
      await sendMessage(input, receiver);
    } catch (error) {
      console.log(error);
    }

    setInput("");
  };

  const fetchData = async () => {
    try {
      const res = await getMessages(receiver);
      setMessages((messages) => [...messages, ...res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex flex-col h-100 w-64 border rounded-md pt-4">
      <div className="absolute top-0 bg-indigo-700 w-100 py-2 flex justify-between mb-5">
        <div className="flex text-white items-center gap-1 px-3">
          <img
            alt="Placeholder"
            className="block rounded-full h-8 w-8 object-cover"
            src={photo.substring(0, 5) === "https"
            ? photo
            : `/../../../${photo.substring(7, photo.length)}`}
          />
          {name}
        </div>

        <i
          className="fa fa-times text-white pr-2 items-center cursor pl-40 pt-1"
          aria-hidden="true"
          onClick={close}
        ></i>
      </div>
      <div className="flex-grow-1 px-3 pt-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.sender_id == sender ? "text-right mt-3" : "text-left mt-3"
            }
          >
            <div className="">
              <span
                className={`py-2 px-1 mt-3 rounded text-white ${
                  message.sender_id == sender ? "bg-indigo-400" : "bg-gray-500"
                }`}
              >
                {message.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-light p-4 border-top">
        <div className="flex flex-column space-evenly">
          <div className="flex flex-row">
            <input
              id="title"
              type="text"
              className="form-control mr-1 border border-gray-500 rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") send();
              }}
            />

            <button onClick={send} className="btn btn-primary">
              <i className="fa fa-paper-plane" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


