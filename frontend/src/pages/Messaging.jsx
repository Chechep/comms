// src/pages/Messaging.jsx
import { useState, useEffect } from "react";
import {
  Send,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Phone,
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

export default function Messaging() {
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [preview, setPreview] = useState("");
  const [recipientCount, setRecipientCount] = useState(0);

  const user = auth.currentUser;

  // ✅ Fetch groups from contacts collection
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

  // ✅ Update preview from template
  useEffect(() => {
    if (selectedTemplate) {
      setPreview(selectedTemplate.message);
    } else {
      setPreview("");
    }
  }, [selectedTemplate]);

  // ✅ Toggle group selection
  const toggleGroup = async (group) => {
    let updatedGroups = selectedGroups.includes(group)
      ? selectedGroups.filter((g) => g !== group)
      : [...selectedGroups, group];

    setSelectedGroups(updatedGroups);

    // Fetch contacts for selected groups
    if (!user) return;
    let allRecipients = [];
    for (const g of updatedGroups) {
      const q = query(
        collection(db, "contacts"),
        where("uid", "==", user.uid),
        where("group", "==", g)
      );
      const snapshot = await getDocs(q);
      const contacts = snapshot.docs.map((doc) => doc.data());
      allRecipients = [...allRecipients, ...contacts];
    }

    // Remove duplicates by phone/email
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

  // ✅ Handle Send
  const handleSend = async () => {
    if (!user || selectedGroups.length === 0 || selectedChannels.length === 0) {
      alert("⚠️ Please select at least one group, one template, and one channel.");
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

      // Save logs for each recipient + channel
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
              timestamp: serverTimestamp(),
              status: "pending",
            }
          );

          // Simulate delivery after 2–5s
          setTimeout(async () => {
            const randomOutcome = Math.random();
            let status = "delivered";
            if (randomOutcome < 0.2) status = "failed"; // 20% fail chance

            await updateDoc(doc(db, "users", user.uid, "messages", ref.id), {
              status,
            });
          }, Math.floor(Math.random() * 3000) + 2000);
        }
      }

      alert(
        `✅ Message queued for ${uniqueRecipients.length} recipients across ${selectedGroups.length} groups`
      );
      setSelectedGroups([]);
      setSelectedTemplate(null);
      setSelectedChannels([]);
      setPreview("");
      setRecipientCount(0);
    } catch (err) {
      console.error("Error sending messages:", err);
      alert("❌ Failed to send messages.");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Step 3: Messaging</h1>
      <p className="opacity-80">
        Choose groups, apply templates, and send via multiple channels.
      </p>

      {/* Select Groups */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <Users className="w-6 h-6 text-[var(--color-brand)]" />
          Select Groups
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
          <p className="mt-3 text-sm opacity-80">
            ✅ {recipientCount} total recipients will get this message
          </p>
        )}
      </div>

      {/* Select Template */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <FileText className="w-6 h-6 text-[var(--color-brand)]" />
          Choose Template
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

      {/* Choose Channels */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <Send className="w-6 h-6 text-[var(--color-brand)]" />
          Select Channels
        </h2>
        <div className="flex gap-6">
          {[
            { name: "SMS", icon: Phone },
            { name: "Email", icon: Mail },
            { name: "WhatsApp", icon: MessageSquare },
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
              <Icon className="w-5 h-5" />
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Preview & Send */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-2">Message Preview</h2>
        <textarea
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          rows="4"
          className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
        ></textarea>
        <button
          onClick={handleSend}
          className="mt-4 px-6 py-2 rounded-md shadow-md flex items-center gap-2 hover:scale-105"
          style={{ background: "var(--color-brand)", color: "#fff" }}
        >
          <Send className="w-5 h-5" /> Send Messages
        </button>
      </div>
    </div>
  );
}
