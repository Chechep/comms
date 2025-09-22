// src/components/Chatbot.jsx
import { useState, useEffect } from "react";
import { MessageCircle, Minus, Plus, X } from "lucide-react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
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
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(db, "chatbot", user.uid, "messages"), {
      text: input,
      sender: "user",
      timestamp: serverTimestamp(),
    });

    let reply = "Ganji ndo inabonga";
    if (input.toLowerCase().includes("hello")) reply = "Hello! 👋";
    if (input.toLowerCase().includes("help"))
      reply = "Sure, what do you need help with?";
    if (input.toLowerCase().includes("template"))
      reply = "You can create templates in the Templates page.";

    await addDoc(collection(db, "chatbot", user.uid, "messages"), {
      text: reply,
      sender: "bot",
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = async () => {
    if (!user) return;
    const q = query(collection(db, "chatbot", user.uid, "messages"));
    messages.forEach(async (msg) => {
      await deleteDoc(doc(db, "chatbot", user.uid, "messages", msg.id));
    });
  };

  return (
    <div className="fixed bottom-4 left-4">
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[var(--color-brand)] p-4 rounded-full shadow-lg text-white hover:opacity-90"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="w-80 h-96 bg-[var(--color-brand-dark)] text-[var(--color-text)] rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-[var(--color-brand)] text-white p-3 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Chatbot</span>
            <div className="flex gap-2 items-center">
              {/* New Chat with Tooltip */}
              <div className="relative group">
                <button
                  onClick={handleNewChat}
                  className="hover:opacity-80"
                >
                  <Plus size={18} />
                </button>
                <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  New Chat
                </span>
              </div>

              {/* Close */}
              <div className="relative group">
                <button
                  onClick={() => setOpen(false)}
                  className="hover:opacity-80"
                >
                  <X size={18} />
                </button>
                <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Close
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          {!minimized && (
            <>
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg max-w-[70%] ${
                      msg.sender === "user"
                        ? "bg-[var(--color-brand)] text-white self-end ml-auto"
                        : "bg-[var(--color-brand)] text-white self-start mr-auto"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[var(--color-brand)] flex gap-2 bg-[var(--color-brand-dark)]">
                <input
                  className="flex-1 border rounded px-2 bg-[var(--color-brand-darker)] text-[var(--color-text)] placeholder-gray-300 focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="bg-[var(--color-brand)] text-white px-3 rounded hover:opacity-90"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
