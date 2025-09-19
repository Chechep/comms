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
} from "firebase/firestore";

export default function Messaging() {
  const [contacts, setContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [preview, setPreview] = useState("");

  const user = auth.currentUser;

  // Fetch contacts
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "contacts"),
      (snapshot) => {
        setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Fetch templates
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

  // Update preview when template selected
  useEffect(() => {
    if (selectedTemplate) {
      setPreview(selectedTemplate.message);
    } else {
      setPreview("");
    }
  }, [selectedTemplate]);

  // Toggle contact selection
  const toggleContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Toggle channel selection
  const toggleChannel = (channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  // Handle send → Save to Firestore
  const handleSend = async () => {
    if (!user || selectedContacts.length === 0 || selectedChannels.length === 0) {
      alert("⚠️ Please select at least one contact, one template, and one channel.");
      return;
    }

    try {
      for (const contactId of selectedContacts) {
        const contact = contacts.find((c) => c.id === contactId);

        for (const channel of selectedChannels) {
          const ref = await addDoc(collection(db, "users", user.uid, "messages"), {
            contactId: contact.id,
            contactName: contact.name || "Unnamed",
            contactPhone: contact.phone || "",
            contactEmail: contact.email || "",
            channel,
            templateId: selectedTemplate?.id || null,
            templateTitle: selectedTemplate?.title || "",
            message: preview,
            timestamp: serverTimestamp(),
            status: "pending", // start as pending
          });

          // Simulate delivery after 2–5 seconds
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

      alert("✅ Messages stored in Firestore (simulation). APIs can send them for real next!");
      setSelectedContacts([]);
      setSelectedTemplate(null);
      setSelectedChannels([]);
      setPreview("");
    } catch (err) {
      console.error("Error sending messages:", err);
      alert("❌ Failed to send messages.");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Step 3: Messaging</h1>
      <p className="opacity-80">
        Choose contacts, apply templates, and send via multiple channels.
      </p>

      {/* Select Contacts */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <Users className="w-6 h-6 text-[var(--color-brand)]" />
          Select Contacts
        </h2>
        {contacts.length === 0 ? (
          <p className="opacity-70">No contacts found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleContact(c.id)}
                className={`px-3 py-2 rounded border ${
                  selectedContacts.includes(c.id)
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-bg-input)]"
                }`}
              >
                {c.name}{" "}
                <span className="opacity-70 text-xs">
                  {c.phone || c.email}
                </span>
              </button>
            ))}
          </div>
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
