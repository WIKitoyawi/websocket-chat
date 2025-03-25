import { useEffect, useState, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");
    ws.current.onopen = () => console.log("Connected to WebSocket");

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "history") {
        setMessages(message.data.map(msg => msg.data));
      } else if (message.type === "message") {
        setMessages(prev => [...prev, message.data]);
      }
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      ws.current.send(JSON.stringify({ type: "message", data: input }));
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white border">
      <div className="h-96 overflow-y-auto border p-2">
        {messages.map((msg, index) => (
          <div key={index} className="p-1 border-b">{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t">
        <input
          className="w-full p-2 border mb-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Введите сообщение..."
        />
        <button className="w-full p-2 bg-blue-500 text-white" onClick={sendMessage}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
