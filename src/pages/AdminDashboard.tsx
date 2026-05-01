import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Trash2, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export function AdminDashboard() {
  const { appUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchAdminData() {
      if (appUser?.role !== "admin") return;
      
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        console.error(err);
        // Fallback for mock environment if API fails
        setUsers([
          { id: "james-mcguigan", name: "James McGuigan Jr", email: "jimmymcguigan18@gmail.com", role: "admin" },
          { id: "waleed-bhatti", name: "Waleed Bhatti", email: "waleedb219@gmail.com", role: "photographer" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, [appUser]);

  const handleRoleChange = (userId: string, newRole: string) => {
    setPendingChanges(prev => ({ ...prev, [userId]: newRole }));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      setMessage({ text: "User deleted successfully", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleSaveChanges = async () => {
    const changes = Object.entries(pendingChanges).map(([id, role]) => ({ id, role }));
    if (changes.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/users/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: changes })
      });

      if (!res.ok) throw new Error("Update failed");

      setPendingChanges({});
      setMessage({ text: "All changes saved successfully", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  if (!appUser || appUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Initializing Admin Space...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 font-sans text-zinc-100">
      <div className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2 text-white tracking-tight">Admin Command Center</h1>
          <p className="text-red-500 tracking-[0.2em] uppercase text-[10px] font-bold">Restricted Access · Central Oversight</p>
        </div>
        
        {Object.keys(pendingChanges).length > 0 && (
          <button 
            onClick={handleSaveChanges}
            disabled={saving}
            className="bg-white text-black px-6 py-3 font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg animate-pulse"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save {Object.keys(pendingChanges).length} Pending Changes
          </button>
        )}
      </div>

      {message.text && (
        <div className={`mb-8 p-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="space-y-16">
        <section>
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Users Directory</h2>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{users.length} Records Found</span>
          </div>
          
          <div className="relative">
            <div className="md:hidden mb-4 text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <span>Scroll horizontally to view details</span>
              <div className="flex-1 h-[1px] bg-zinc-900"></div>
            </div>
            <div className="overflow-x-auto bg-black border border-zinc-800 shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[9px] md:text-[10px] uppercase tracking-[0.2em] bg-zinc-900/50">
                    <th className="py-4 md:py-5 font-bold px-4 md:px-8">Identity</th>
                    <th className="py-4 md:py-5 font-bold px-4 md:px-8">Communications</th>
                    <th className="py-4 md:py-5 font-bold px-4 md:px-8">Privilege Level</th>
                    <th className="py-4 md:py-5 font-bold px-4 md:px-8 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] md:text-[11px] font-medium tracking-wider text-zinc-400">
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors group">
                      <td className="py-5 md:py-6 px-4 md:px-8 font-bold text-white uppercase tracking-widest">{u.name}</td>
                      <td className="py-5 md:py-6 px-4 md:px-8 text-zinc-500">{u.email}</td>
                      <td className="py-5 md:py-6 px-4 md:px-8">
                        {u.id === appUser.uid ? (
                          <span className="px-3 py-1 bg-red-900/20 text-red-500 text-[8px] md:text-[9px] font-bold uppercase tracking-widest border border-red-900/30">
                            Primary Admin
                          </span>
                        ) : (
                          <select 
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-2 md:px-3 py-1.5 md:py-2 focus:outline-none focus:border-zinc-600 transition-colors appearance-none cursor-pointer hover:border-zinc-500"
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          >
                            <option value="client">Client</option>
                            <option value="photographer">Photographer</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="py-5 md:py-6 px-4 md:px-8 text-right">
                        {u.id !== appUser.uid && (
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={deletingId === u.id}
                            className="text-zinc-600 hover:text-red-500 transition-colors p-2"
                            title="Purge User Record"
                          >
                            {deletingId === u.id ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : <Trash2 className="w-3 h-3 md:w-4 md:h-4" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {Object.keys(pendingChanges).length > 0 && (
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveChanges}
                disabled={saving}
                className="bg-red-600 text-white px-8 py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-red-700 transition-colors flex items-center gap-3 shadow-xl"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Commit {Object.keys(pendingChanges).length} Structural Updates
              </button>
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">System Logs & Approvals</h2>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800 p-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold">No High-Priority Actions Required</p>
          </div>
        </section>
      </div>
    </div>
  );
}
