// src/pages/Templates.jsx
import { useState, useEffect } from "react";
import {
  FileText,
  PlusCircle,
  Trash2,
  Mail,
  MessageSquare,
  Phone,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    message: "",
    channels: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [editTemplate, setEditTemplate] = useState(null);
  const user = auth.currentUser;

  // Real-time listener
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

  // Toggle channel selection
  const toggleChannel = (templateState, setTemplateState, channel) => {
    setTemplateState((prev) => {
      const alreadySelected = prev.channels.includes(channel);
      return {
        ...prev,
        channels: alreadySelected
          ? prev.channels.filter((c) => c !== channel)
          : [...prev.channels, channel],
      };
    });
  };

  // Add template
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplate.title || !newTemplate.message || newTemplate.channels.length === 0) return;
    try {
      await addDoc(collection(db, "users", user.uid, "templates"), newTemplate);
      setNewTemplate({ title: "", message: "", channels: [] });
    } catch (error) {
      console.error("Error adding template:", error);
    }
  };

  // Delete template
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "templates", id));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  // Start editing
  const startEditing = (template) => {
    setEditingId(template.id);
    setEditTemplate({ ...template });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditTemplate(null);
  };

  // Save edits
  const saveEdit = async () => {
    if (!editTemplate.title || !editTemplate.message || editTemplate.channels.length === 0) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "templates", editingId), editTemplate);
      setEditingId(null);
      setEditTemplate(null);
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Step 2: Templates</h1>
      <p className="opacity-80">
        Create, manage, and edit reusable multi-channel message templates for
        alerts, reminders, and notifications.
      </p>

      {/* Add Template */}
      <div className="p-6 border rounded-xl shadow-sm bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <PlusCircle className="w-6 h-6 text-[var(--color-brand)]" />
          New Template
        </h2>
        <form onSubmit={handleAddTemplate} className="space-y-4">
          <input
            type="text"
            placeholder="Template Title"
            value={newTemplate.title}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          />
          <textarea
            placeholder="Template Message..."
            value={newTemplate.message}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, message: e.target.value })
            }
            rows="4"
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          ></textarea>

          {/* Channel Selection */}
          <div className="flex gap-6">
            {["SMS", "Email", "WhatsApp"].map((channel) => {
              const Icon =
                channel === "SMS" ? Phone : channel === "Email" ? Mail : MessageSquare;
              return (
                <label
                  key={channel}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer ${
                    newTemplate.channels.includes(channel)
                      ? "bg-[var(--color-brand)] text-white"
                      : "bg-[var(--color-bg-input)]"
                  }`}
                  onClick={() =>
                    toggleChannel(newTemplate, setNewTemplate, channel)
                  }
                >
                  <Icon className="w-5 h-5" />
                  {channel}
                </label>
              );
            })}
          </div>

          <button
            type="submit"
            className="px-6 py-2 rounded-md shadow-md transition hover:scale-105"
            style={{ background: "var(--color-brand)", color: "#fff" }}
          >
            Save Template
          </button>
        </form>
      </div>

      {/* Template List */}
      <div className="p-6 border rounded-xl shadow-sm bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-[var(--color-brand)]" />
          Saved Templates
        </h2>
        {templates.length === 0 ? (
          <p className="opacity-70">No templates created yet.</p>
        ) : (
          <ul className="space-y-3">
            {templates.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-start border-b pb-2"
              >
                {editingId === t.id ? (
                  <div className="flex-1 space-y-2">
                    {/* Edit Mode */}
                    <input
                      type="text"
                      value={editTemplate.title}
                      onChange={(e) =>
                        setEditTemplate({ ...editTemplate, title: e.target.value })
                      }
                      className="w-full px-3 py-1 border rounded-md"
                    />
                    <textarea
                      value={editTemplate.message}
                      onChange={(e) =>
                        setEditTemplate({ ...editTemplate, message: e.target.value })
                      }
                      rows="3"
                      className="w-full px-3 py-1 border rounded-md"
                    />
                    <div className="flex gap-4">
                      {["SMS", "Email", "WhatsApp"].map((channel) => {
                        const Icon =
                          channel === "SMS"
                            ? Phone
                            : channel === "Email"
                            ? Mail
                            : MessageSquare;
                        return (
                          <label
                            key={channel}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md border cursor-pointer ${
                              editTemplate.channels.includes(channel)
                                ? "bg-[var(--color-brand)] text-white"
                                : "bg-[var(--color-bg-input)]"
                            }`}
                            onClick={() =>
                              toggleChannel(editTemplate, setEditTemplate, channel)
                            }
                          >
                            <Icon className="w-4 h-4" />
                            {channel}
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white"
                      >
                        <Check className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-1 px-3 py-1 rounded bg-gray-400 text-white"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="font-semibold">{t.title}</h3>
                    <p className="text-sm opacity-80">{t.message}</p>
                    <div className="flex gap-2 mt-1">
                      {t.channels?.map((c) => {
                        const Icon =
                          c === "SMS" ? Phone : c === "Email" ? Mail : MessageSquare;
                        return (
                          <span
                            key={c}
                            className="text-xs px-2 py-1 rounded-md bg-[var(--color-brand)]/20 text-[var(--color-brand)] flex items-center gap-1"
                          >
                            <Icon className="w-3 h-3" />
                            {c}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 ml-4">
                  {editingId !== t.id && (
                    <button
                      onClick={() => startEditing(t)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
