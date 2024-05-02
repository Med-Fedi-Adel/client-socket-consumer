import { useContext, useEffect, useState } from "react";
import { webSocketContext } from "../contexts/WebsocketContext";
import { Message } from "./Message";

export const Websocket = () => {
  const [value, setValue] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const socket = useContext(webSocketContext);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      fetch("http://localhost:9001/messages", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Messages fetched successfully");
          console.log(data);
          setMessages(data);
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    };

    fetchMessages();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("onMessage", (data) => {
      console.log("onMessage event received");
      console.log(data);
      setLoading(true);
      setMessages((prev) => [...prev, data.content]);
      setLoading(false);
    });

    return () => {
      console.log("Unregistering Events...");
      socket.off("connect");
      socket.off("onMessage");
    };
  }, [socket]);

  const onSubmit = () => {
    if (value && userName)
      socket.emit("newMessage", {
        userName: userName,
        content: value,
      });
    setValue("");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Petite Messagerie</h1>

        <div id="chat-container" className="fixed bottom-36 w-96">
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Set Username"
                className="text-blue-500 bg-white px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div id="chatbox" className="p-4 h-80 overflow-y-auto">
              {messages.length ? (
                messages.map((msg, idx) => (
                  <Message
                    userName={userName}
                    author={msg.userName}
                    body={msg.content}
                    key={idx}
                  />
                ))
              ) : (
                <div>No Messages...</div>
              )}
            </div>
            <div className="p-4 border-t flex">
              <input
                id="user-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                placeholder="Type a message"
                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                id="send-button"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
                onClick={onSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
