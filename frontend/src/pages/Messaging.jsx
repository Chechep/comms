// src/pages/Messaging.jsx
import { useState, useEffect } from "react";
import {
  Send,
  Users,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// ✅ Custom WhatsApp SVG
const WhatsAppIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.52 3.48A11.8 11.8 0 0 0 12 0C5.37 0 0 5.37 0 12c0 
    2.1.55 4.14 1.6 5.95L0 24l6.2-1.62A11.95 11.95 0 0 0 12 
    24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 
    21.82c-2.01 0-3.97-.53-5.68-1.55l-.4-.23-3.68.96.98-3.59-.25
    -.41A9.82 9.82 0 0 1 2.18 12c0-5.42 4.4-9.82 
    9.82-9.82 2.62 0 5.09 1.02 6.95 2.88a9.77 9.77 0 
    0 1 2.87 6.94c0 5.42-4.4 9.82-9.82 
    9.82zm5.39-7.39c-.29-.14-1.7-.84-1.97-.94-.27-.1-.47-.14-.66
    .14-.2.29-.76.94-.93 1.13-.17.19-.34.21-.63.07-.29-.14-1.22
    -.45-2.33-1.43-.86-.77-1.44-1.73-1.61-2.01-.17-.29-.02-.45
    .13-.59.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05
    -.36-.02-.5-.07-.14-.66-1.6-.91-2.2-.24-.58-.49-.5-.66-.51h
    -.57c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.82 
    1.18 3.01.14.19 2.02 3.07 4.89 4.3.68.29 1.21.46 1.62.59.68
    .22 1.3.19 1.79.12.55-.08 1.7-.7 1.94-1.38.24-.67.24-1.24
    .17-1.36-.07-.12-.26-.19-.55-.33z" />
  </svg>
);

export default function Messaging() {
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [preview, setPreview] = useState("");
  const [recipientCount, setRecipientCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const user = auth.currentUser;

  // ✅ Fetch groups from contacts
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "contacts"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((doc) => doc.data());
      const uniqueGroups = [...new Set(all.map((c) => c.group || "General"))];
      setGroups(uniqueGroups);
    });
    return () => unsubscribe();
  }, [user]);

  // ✅ Fetch templates
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "templates"),
      (snapshot) => {
        setTemplates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsubscribe();
  }, [user]);

  // ✅ Update preview when template changes
  useEffect(() => {
    setPreview(selectedTemplate ? selectedTemplate.message : "");
  }, [selectedTemplate]);

  // ✅ Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ✅ Toggle group selection
  const toggleGroup = async (group) => {
    const updatedGroups = selectedGroups.includes(group)
      ? selectedGroups.filter((g) => g !== group)
      : [...selectedGroups, group];

    setSelectedGroups(updatedGroups);

    if (!user) return;

    let allRecipients = [];
    for (const g of updatedGroups) {
      const q = query(
        collection(db, "contacts"),
        where("uid", "==", user.uid),
        where("group", "==", g)
      );
      const snapshot = await getDocs(q);
      allRecipients = [...allRecipients, ...snapshot.docs.map((doc) => doc.data())];
    }

    const uniqueRecipients = Object.values(
      allRecipients.reduce((acc, c) => {
        const key = c.phone || c.email;
        if (!acc[key]) acc[key] = c;
        return acc;
      }, {})
    );

    setRecipientCount(uniqueRecipients.length);
  };

  // ✅ Toggle channel selection
  const toggleChannel = (channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  // ✅ Handle send
  const handleSend = async () => {
    if (!user || selectedGroups.length === 0 || !selectedTemplate || selectedChannels.length === 0) {
      setToast({ type: "error", message: "⚠️ Select group, template, and channel" });
      return;
    }

    try {
      let allRecipients = [];
      for (const group of selectedGroups) {
        const q = query(
          collection(db, "contacts"),
          where("uid", "==", user.uid),
          where("group", "==", group)
        );
        const snapshot = await getDocs(q);
        allRecipients = [...allRecipients, ...snapshot.docs.map((doc) => doc.data())];
      }

      const uniqueRecipients = Object.values(
        allRecipients.reduce((acc, c) => {
          const key = c.phone || c.email;
          if (!acc[key]) acc[key] = c;
          return acc;
        }, {})
      );

      for (const contact of uniqueRecipients) {
        for (const channel of selectedChannels) {
          const ref = await addDoc(
            collection(db, "users", user.uid, "messages"),
            {
              contactName: contact.name || "Unnamed",
              contactPhone: contact.phone || "",
              contactEmail: contact.email || "",
              groups: selectedGroups,
              channel,
              templateId: selectedTemplate?.id || null,
              templateTitle: selectedTemplate?.title || "",
              message: preview,
              scheduleDate: scheduleDate || null,
              scheduleTime: scheduleTime || null,
              timestamp: serverTimestamp(),
              status: "pending",
            }
          );

          // simulate delivery status
          setTimeout(async () => {
            const randomOutcome = Math.random();
            let status = "delivered";
            if (randomOutcome < 0.2) status = "failed";
            await updateDoc(doc(db, "users", user.uid, "messages", ref.id), { status });
          }, Math.floor(Math.random() * 3000) + 2000);
        }
      }

      setToast({ type: "success", message: `✅ Queued for ${uniqueRecipients.length} recipients.` });
      setSelectedGroups([]);
      setSelectedTemplate(null);
      setSelectedChannels([]);
      setPreview("");
      setRecipientCount(0);
      setScheduleDate("");
      setScheduleTime("");
    } catch (err) {
      console.error("Error sending:", err);
      setToast({ type: "error", message: "❌ Failed to send messages." });
    }
  };

  return (
    <div className="p-8 space-y-8 relative">
      <h1 className="text-3xl font-bold mb-4">Step 3: Messaging</h1>
      <p className="opacity-80">Choose groups, apply templates, and send via SMS, Email, or WhatsApp.</p>

      {/* Select Groups */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <Users className="w-6 h-6 text-[var(--color-brand)]" /> Select Groups
        </h2>
        {groups.length === 0 ? (
          <p className="opacity-70">No groups found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => toggleGroup(g)}
                className={`px-3 py-2 rounded border ${
                  selectedGroups.includes(g)
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-bg-input)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}
        {recipientCount > 0 && (
          <p className="mt-3 text-sm opacity-80">✅ {recipientCount} recipients will get this message</p>
        )}
      </div>

      {/* Select Template */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <FileText className="w-6 h-6 text-[var(--color-brand)]" /> Choose Template
        </h2>
        {templates.length === 0 ? (
          <p className="opacity-70">No templates found.</p>
        ) : (
          <div className="space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full text-left px-3 py-2 rounded border ${
                  selectedTemplate?.id === t.id
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-bg-input)]"
                }`}
              >
                <span className="font-semibold">{t.title}</span>
                <p className="text-sm opacity-80 truncate">{t.message}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Select Channels */}
<div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
  <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
    <Send className="w-6 h-6 text-[var(--color-brand)]" /> Select Channels
  </h2>
  <div className="flex gap-6">
    {[
      { name: "SMS", icon: MessageSquare },
      { name: "Email", icon: Mail },
      { name: "WhatsApp", icon: WhatsAppIcon },
    ].map(({ name, icon: Icon }) => (
      <button
        key={name}
        onClick={() => toggleChannel(name)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
          selectedChannels.includes(name)
            ? "bg-[var(--color-brand)] text-white"
            : "bg-[var(--color-bg-input)]"
        }`}
      >
        <Icon className="w-5 h-5" /> {name}
      </button>
    ))}
  </div>
</div>


      {/* Scheduler */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-2">Schedule Message</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="px-3 py-2 rounded-md border bg-[var(--color-bg-input)]"
          />
          <input
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="px-3 py-2 rounded-md border bg-[var(--color-bg-input)]"
          />
        </div>
      </div>

      {/* Preview & Send */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-2">Message Preview</h2>
        <textarea
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          rows="4"
          placeholder="Type or select a template..."
          className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)] placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          className="mt-4 px-6 py-2 rounded-md shadow-md flex items-center gap-2 hover:scale-105"
          style={{ background: "var(--color-brand)", color: "#fff" }}
        >
          <Send className="w-5 h-5" /> Send Messages
        </button>
      </div>

      {/* ✅ Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-md shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
