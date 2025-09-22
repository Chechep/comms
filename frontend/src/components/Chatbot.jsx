// src/components/Chatbot.jsx
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chatbot", user.uid, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    // Save user message
    await addDoc(collection(db, "chatbot", user.uid, "messages"), {
      text: input,
      sender: "user",
      timestamp: serverTimestamp(),
    });

    // Simple bot response
    let reply = "I'm not sure about that 🤔";
    if (input.toLowerCase().includes("hello")) reply = "Hello! 👋";
    if (input.toLowerCase().includes("help")) reply = "Sure, what do you need help with?";
    if (input.toLowerCase().includes("template"))
      reply = "You can create templates in the Templates page.";

    // Save bot reply
    await addDoc(collection(db, "chatbot", user.uid, "messages"), {
      text: reply,
      sender: "bot",
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-green-500 p-4 rounded-full shadow-lg text-white hover:bg-green-600"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="w-80 h-96 bg-[var(--color-bg)] text-[var(--color-text)] rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span>Chatbot</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white self-end ml-auto"
                    : "bg-gray-700 text-white self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-[var(--color-bg)]">
            <input
              className="flex-1 border rounded px-2 bg-[var(--color-bg-input)] text-[var(--color-text)]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
