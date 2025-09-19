// src/pages/Contacts.jsx
import { useState, useEffect } from "react";
import {
  UploadCloud,
  UserPlus,
  Trash2,
  Edit3,
  Save,
  X,
  FileSpreadsheet,
  Loader2,
  Shield,
} from "lucide-react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Member",
    group: "General",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Member",
    group: "General",
  });
  const [uploading, setUploading] = useState(false);
  const [filterGroup, setFilterGroup] = useState("All"); // 👈 added filter

  const user = auth.currentUser;

  // Roles available
  const roles = ["Admin", "Manager", "Staff", "Member", "Guest"];

  // Groups available
  const groups = ["General", "Family", "Work", "Clients", "Vendors"];

  // Role colors
  const roleColors = {
    Admin: "bg-red-100 text-red-700 border border-red-300",
    Manager: "bg-blue-100 text-blue-700 border border-blue-300",
    Staff: "bg-green-100 text-green-700 border border-green-300",
    Member: "bg-purple-100 text-purple-700 border border-purple-300",
    Guest: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  // Realtime Firestore listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "contacts"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContacts(list);
    });

    return () => unsubscribe();
  }, [user]);

  // Add contact manually
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    try {
      await addDoc(collection(db, "contacts"), {
        ...newContact,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewContact({ name: "", phone: "", email: "", role: "Member", group: "General" });
    } catch (err) {
      console.error("Error adding contact:", err);
    }
  };

  // Delete contact
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  // Edit contact
  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      role: contact.role || "Member",
      group: contact.group || "General",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", phone: "", email: "", role: "Member", group: "General" });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "contacts", id), { ...editData });
      cancelEdit();
    } catch (err) {
      console.error("Error updating contact:", err);
    }
  };

  // Bulk upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      let rows = [];

      if (file.name.endsWith(".csv")) {
        const result = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (err) => reject(err),
          });
        });
        rows = result;
      } else if (file.name.endsWith(".xlsx")) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        alert("Unsupported file format. Please upload CSV or Excel.");
        setUploading(false);
        return;
      }

      const batch = writeBatch(db);
      rows.forEach((row) => {
        const docRef = doc(collection(db, "contacts"));
        batch.set(docRef, {
          name: row.name || row.Name || "Unnamed",
          phone: row.phone || row.Phone || "",
          email: row.email || row.Email || "",
          role: row.role || row.Role || "Member",
          group: row.group || row.Group || "General",
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
      });

      await batch.commit();
      alert(`Successfully imported ${rows.length} contacts!`);
    } catch (err) {
      console.error("File upload error:", err);
      alert("Failed to import contacts. Check file format.");
    } finally {
      setUploading(false);
    }
  };

  // 👉 Apply group filter
  const filteredContacts =
    filterGroup === "All"
      ? contacts
      : contacts.filter((c) => c.group === filterGroup);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Step 1: Contacts</h1>
      <p className="opacity-80">Import your contacts via CSV/Excel or add them manually.</p>

      {/* Upload Section */}
      <div className="p-6 border rounded-xl shadow-sm bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <UploadCloud className="w-6 h-6 text-[var(--color-brand)]" />
          Import Contacts
        </h2>
        <label className="flex items-center gap-3 cursor-pointer border p-3 rounded-lg hover:bg-[var(--color-bg-input)] transition">
          <FileSpreadsheet className="w-6 h-6 text-green-600" />
          <span className="font-medium">
            {uploading ? "Uploading..." : "Choose CSV or Excel file"}
          </span>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
          {uploading && <Loader2 className="w-5 h-5 animate-spin text-[var(--color-brand)] ml-auto" />}
        </label>
      </div>

      {/* Manual Add Section */}
      <div className="p-6 border rounded-xl shadow-sm bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <UserPlus className="w-6 h-6 text-[var(--color-brand)]" />
          Add Contact
        </h2>
        <form onSubmit={handleAddContact} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          />
          <select
            value={newContact.role}
            onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={newContact.group}
            onChange={(e) => setNewContact({ ...newContact, group: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          >
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 rounded-md shadow-md transition hover:scale-105"
            style={{ background: "var(--color-brand)", color: "#fff" }}
          >
            Add Contact
          </button>
        </form>
      </div>

      {/* Contact List */}
      <div className="p-6 border rounded-xl shadow-sm bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-[var(--color-brand)]" />
          Contact List
        </h2>

        {/* 👇 Group Filter Dropdown */}
        <div className="mb-4">
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          >
            <option value="All">All Groups</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {filteredContacts.length === 0 ? (
          <p className="opacity-70">No contacts in this group.</p>
        ) : (
          <ul className="space-y-2">
            {filteredContacts.map((c) => (
              <li key={c.id} className="flex justify-between items-center border-b pb-2">
                {editingId === c.id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-2 py-1 border rounded-md"
                    />
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-2 py-1 border rounded-md"
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-2 py-1 border rounded-md"
                    />
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className="w-full px-2 py-1 border rounded-md"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editData.group}
                      onChange={(e) => setEditData({ ...editData, group: e.target.value })}
                      className="w-full px-2 py-1 border rounded-md"
                    >
                      {groups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span>
                    <strong>{c.name}</strong> — {c.phone}{" "}
                    {c.email && `(${c.email})`}{" "}
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        roleColors[c.role] || roleColors.Member
                      }`}
                    >
                      {c.role || "Member"}
                    </span>
                  </span>
                )}

                <div className="flex gap-2 ml-4">
                  {editingId === c.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(c.id)}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-gray-600 hover:text-gray-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
