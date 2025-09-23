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
  XCircle,
  FolderX,
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
  const [groups, setGroups] = useState([]); // 👈 dynamic groups
  const [csvFiles, setCsvFiles] = useState([]); // 👈 track uploaded CSV files
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Member",
    group: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Member",
    group: "",
  });
  const [uploading, setUploading] = useState(false);
  const [filterGroup, setFilterGroup] = useState("All");
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvGroup, setCsvGroup] = useState("");
  const [csvFileName, setCsvFileName] = useState("");

  const user = auth.currentUser;

  // Roles available
  const roles = ["Admin", "Manager", "Staff", "Member", "Guest"];

  // Role colors
  const roleColors = {
    Admin: "bg-red-100 text-red-700 border border-red-300",
    Manager: "bg-blue-100 text-blue-700 border border-blue-300",
    Staff: "bg-green-100 text-green-700 border border-green-300",
    Member: "bg-purple-100 text-purple-700 border border-purple-300",
    Guest: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  // 🔹 Realtime Firestore listeners
  useEffect(() => {
    if (!user) return;

    // Contacts
    const q1 = query(
      collection(db, "contacts"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub1 = onSnapshot(q1, (snapshot) => {
      setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Groups
    const q2 = query(
      collection(db, "groups"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub2 = onSnapshot(q2, (snapshot) => {
      setGroups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // CSV Files
    const q3 = query(
      collection(db, "csvFiles"),
      where("uid", "==", user.uid),
      orderBy("importedAt", "desc")
    );
    const unsub3 = onSnapshot(q3, (snapshot) => {
      setCsvFiles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [user]);

  // 🔹 Add group if not exist
  const ensureGroup = async (groupName) => {
    if (!groupName.trim()) return;
    const exists = groups.some((g) => g.name === groupName);
    if (!exists) {
      await addDoc(collection(db, "groups"), {
        uid: user.uid,
        name: groupName,
        createdAt: serverTimestamp(),
      });
    }
  };

  // 🔹 Add contact manually
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone || !newContact.group) {
      return alert("Please fill in all required fields including group.");
    }

    try {
      await ensureGroup(newContact.group);

      await addDoc(collection(db, "contacts"), {
        ...newContact,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewContact({ name: "", phone: "", email: "", role: "Member", group: "" });
    } catch (err) {
      console.error("Error adding contact:", err);
    }
  };

  // 🔹 Delete contact
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  // 🔹 Edit contact
  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "",
      role: contact.role || "Member",
      group: contact.group || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", phone: "", email: "", role: "Member", group: "" });
  };

  const handleSaveEdit = async (id) => {
    if (!editData.group) return alert("Group is required.");
    try {
      await ensureGroup(editData.group);
      await updateDoc(doc(db, "contacts", id), { ...editData });
      cancelEdit();
    } catch (err) {
      console.error("Error updating contact:", err);
    }
  };

  // 🔹 Handle file preview
  const handleFilePreview = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setCsvFileName(file.name);

    try {
      let rows = [];
      if (file.name.endsWith(".csv")) {
        rows = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (err) => reject(err),
          });
        });
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

      setCsvPreview(rows);
    } catch (err) {
      console.error("File preview error:", err);
      alert("Failed to preview contacts.");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Confirm CSV import
  const handleConfirmCsv = async () => {
    if (!csvGroup) return alert("Please enter a group for imported contacts.");
    if (!csvPreview) return;

    try {
      await ensureGroup(csvGroup);

      // Track file in Firestore
      const csvFileRef = await addDoc(collection(db, "csvFiles"), {
        uid: user.uid,
        filename: csvFileName,
        group: csvGroup,
        importedAt: serverTimestamp(),
      });

      // Add contacts
      const batch = writeBatch(db);
      csvPreview.forEach((row) => {
        const docRef = doc(collection(db, "contacts"));
        batch.set(docRef, {
          name: row.name || row.Name || "Unnamed",
          phone: row.phone || row.Phone || "",
          email: row.email || row.Email || "",
          role: row.role || row.Role || "Member",
          group: csvGroup,
          uid: user.uid,
          csvFileId: csvFileRef.id,
          createdAt: serverTimestamp(),
        });
      });

      await batch.commit();
      alert(`✅ Imported ${csvPreview.length} contacts into ${csvGroup}!`);
      setCsvPreview(null);
      setCsvGroup("");
      setCsvFileName("");
    } catch (err) {
      console.error("File import error:", err);
      alert("Failed to import contacts.");
    }
  };

  // 🔹 Cancel CSV preview
  const handleCancelCsv = () => {
    setCsvPreview(null);
    setCsvGroup("");
    setCsvFileName("");
  };

  // 🔹 Delete whole CSV file + its contacts
  const handleDeleteCsvFile = async (fileId) => {
    if (!window.confirm("Delete this file and all its imported contacts?")) return;
    try {
      await deleteDoc(doc(db, "csvFiles", fileId));

      const batch = writeBatch(db);
      contacts
        .filter((c) => c.csvFileId === fileId)
        .forEach((c) => {
          batch.delete(doc(db, "contacts", c.id));
        });
      await batch.commit();
    } catch (err) {
      console.error("Error deleting CSV file:", err);
    }
  };

  // 🔹 Apply group filter
  const filteredContacts =
    filterGroup === "All"
      ? contacts
      : contacts.filter((c) => c.group === filterGroup);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Step 1: Contacts</h1>
      <p className="opacity-80">Import your contacts via CSV/Excel or add them manually.</p>

      {/* Upload Section */}
      <div className="p-6 border rounded-xl shadow-sm bg-[var(--color-bg-alt)] space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-[var(--color-brand)]" />
          Import Contacts
        </h2>
        {!csvPreview ? (
          <>
            <label className="flex items-center gap-3 cursor-pointer border p-3 rounded-lg hover:bg-[var(--color-bg-input)] transition">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
              <span className="font-medium">
                {uploading ? "Uploading..." : "Choose CSV or Excel file"}
              </span>
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFilePreview}
                className="hidden"
              />
              {uploading && <Loader2 className="w-5 h-5 animate-spin ml-auto" />}
            </label>
          </>
        ) : (
          <div className="space-y-3">
            {/* Group Input */}
            <input
              type="text"
              value={csvGroup}
              onChange={(e) => setCsvGroup(e.target.value)}
              placeholder="Enter group name *"
              className="px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
              required
            />
            <span className="text-red-500 text-sm">* Required</span>

            {/* Preview Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {csvPreview.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{row.name || row.Name}</td>
                      <td className="p-2">{row.phone || row.Phone}</td>
                      <td className="p-2">{row.email || row.Email}</td>
                      <td className="p-2">{row.role || row.Role || "Member"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvPreview.length > 5 && (
                <p className="text-xs p-2 opacity-70">
                  Showing first 5 of {csvPreview.length} contacts...
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmCsv}
                className="px-4 py-2 rounded-md text-white"
                style={{ background: "var(--color-brand)" }}
              >
                Confirm Import
              </button>
              <button
                onClick={handleCancelCsv}
                className="px-4 py-2 rounded-md flex items-center gap-2 text-red-600 border border-red-600"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Imported CSV Files */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-green-600" /> Imported Files
        </h2>
        {csvFiles.length === 0 ? (
          <p className="opacity-70">No CSV files imported yet.</p>
        ) : (
          <ul className="space-y-2">
            {csvFiles.map((f) => (
              <li
                key={f.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  <strong>{f.filename}</strong> → Group:{" "}
                  <span className="text-[var(--color-brand)]">{f.group}</span>
                </span>
                <button
                  onClick={() => handleDeleteCsvFile(f.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800"
                >
                  <FolderX className="w-4 h-4" /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Manual Add Section */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <UserPlus className="w-6 h-6 text-[var(--color-brand)]" />
          Add Contact
        </h2>
        <form onSubmit={handleAddContact} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name *"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          />
          <input
            type="text"
            placeholder="Phone Number *"
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
          <input
            type="text"
            placeholder="Enter Group *"
            value={newContact.group}
            onChange={(e) => setNewContact({ ...newContact, group: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
            required
          />
          <span className="text-red-500 text-sm">* Required</span>
          <button
            type="submit"
            className="px-6 py-2 rounded-md shadow-md"
            style={{ background: "var(--color-brand)", color: "#fff" }}
          >
            Add Contact
          </button>
        </form>
      </div>

      {/* Contact List */}
      <div className="p-6 border rounded-xl bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-[var(--color-brand)]" />
          Contact List
        </h2>

        {/* Group Filter */}
        <div className="mb-4">
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-4 py-2 border rounded-md bg-[var(--color-bg-input)]"
          >
            <option value="All">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {filteredContacts.length === 0 ? (
          <p className="opacity-70">No contacts in this group.</p>
        ) : (
          <ul className="space-y-2">
            {filteredContacts.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center border-b pb-2"
              >
                {editingId === c.id ? (
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="px-2 py-1 border rounded"
                    />
                    <input
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      className="px-2 py-1 border rounded"
                    />
                    <input
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="px-2 py-1 border rounded"
                    />
                    <select
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({ ...editData, role: e.target.value })
                      }
                      className="px-2 py-1 border rounded"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <input
                      value={editData.group}
                      onChange={(e) =>
                        setEditData({ ...editData, group: e.target.value })
                      }
                      className="px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => handleSaveEdit(c.id)}
                      className="ml-2 text-green-600"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="text-gray-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span>
                      <strong>{c.name}</strong> ({c.phone}) - {c.group}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          roleColors[c.role] || ""
                        }`}
                      >
                        {c.role}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-blue-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
