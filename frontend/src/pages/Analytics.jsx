import { useState, useEffect } from "react";
import { BarChart2, PieChart, Users, Send } from "lucide-react";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Analytics() {
  const [contacts, setContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [messages, setMessages] = useState([]);

  const user = auth.currentUser;

  // Fetch contacts
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, "users", user.uid, "contacts"),
      (snapshot) => {
        setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsub();
  }, [user]);

  // Fetch templates
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, "users", user.uid, "templates"),
      (snapshot) => {
        setTemplates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsub();
  }, [user]);

  // Fetch messages
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  // Group messages by day for line chart
  const groupedByDate = messages.reduce((acc, msg) => {
    if (!msg.timestamp) return acc; // skip null
    const date = msg.timestamp.toDate
      ? msg.timestamp.toDate().toISOString().split("T")[0]
      : new Date(msg.timestamp).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const timeSeriesData = Object.entries(groupedByDate).map(([date, count]) => ({
    date,
    messages: count,
  }));

  // Messages per channel
  const messagesData = [
    { channel: "SMS", sent: messages.filter((m) => m.channel === "SMS").length },
    { channel: "Email", sent: messages.filter((m) => m.channel === "Email").length },
    { channel: "WhatsApp", sent: messages.filter((m) => m.channel === "WhatsApp").length },
  ];

  // Real delivery status data
  const statusCounts = messages.reduce((acc, msg) => {
    const status = msg.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#4CAF50", "#F44336", "#FF9800", "#2196F3"];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Step 4: Analytics</h1>
      <p className="opacity-80">
        Track your communication performance with real-time data from Firestore.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border bg-[var(--color-bg-alt)] flex flex-col items-center">
          <Users className="w-8 h-8 text-[var(--color-brand)] mb-2" />
          <h2 className="text-xl font-semibold">{contacts.length}</h2>
          <p className="opacity-70">Contacts</p>
        </div>

        <div className="p-6 rounded-xl border bg-[var(--color-bg-alt)] flex flex-col items-center">
          <BarChart2 className="w-8 h-8 text-[var(--color-brand)] mb-2" />
          <h2 className="text-xl font-semibold">{templates.length}</h2>
          <p className="opacity-70">Templates</p>
        </div>

        <div className="p-6 rounded-xl border bg-[var(--color-bg-alt)] flex flex-col items-center">
          <Send className="w-8 h-8 text-[var(--color-brand)] mb-2" />
          <h2 className="text-xl font-semibold">{messages.length}</h2>
          <p className="opacity-70">Messages Sent</p>
        </div>
      </div>

      {/* Time-series Line Chart */}
      <div className="p-6 rounded-xl border bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-4">Messages Sent Per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="messages"
              stroke="var(--color-brand)"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="p-6 rounded-xl border bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-4">Messages per Channel</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={messagesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sent" fill="var(--color-brand)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="p-6 rounded-xl border bg-[var(--color-bg-alt)]">
        <h2 className="text-xl font-semibold mb-4">Delivery Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RePieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="var(--color-brand)"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
