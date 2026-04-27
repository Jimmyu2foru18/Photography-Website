import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AdminDashboard() {
  const { appUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchAdminData() {
      if (appUser?.role !== "admin") return;
      
      setUsers([
        { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
        { id: "2", name: "James McGuigan Jr", email: "jimmymcguigan18@gmail.com", role: "photographer" },
        { id: "3", name: "Waleed Bhatti", email: "waleedb219@gmail.com", role: "photographer" },
        { id: "4", name: "Client Test", email: "client@example.com", role: "client" },
      ]);
      setLoading(false);
    }
    fetchAdminData();
  }, [appUser]);

  if (!appUser || appUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Admin...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 font-sans">
      <div className="mb-12 border-b border-zinc-800 pb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif mb-2 text-white tracking-tight">Admin Command Center</h1>
        <p className="text-red-500 tracking-[0.2em] uppercase text-[10px] font-bold">RESTRICTED ACCESS</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-zinc-800 pb-4">Users Directory</h2>
          <div className="overflow-x-auto bg-black border border-zinc-800 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] uppercase tracking-widest bg-zinc-900">
                  <th className="py-4 font-bold px-6">Name</th>
                  <th className="py-4 font-bold px-6">Email</th>
                  <th className="py-4 font-bold px-6">Role</th>
                  <th className="py-4 font-bold px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium tracking-wider text-zinc-400">
                {users.map(u => (
                  <tr key={u.id} className="border-b border-zinc-800 hover:bg-zinc-900 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">{u.name}</td>
                    <td className="py-4 px-6">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded ${
                        u.role === 'admin' ? 'bg-red-900/30 text-red-500' :
                        u.role === 'photographer' ? 'bg-zinc-800 text-white' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {u.role !== 'admin' && (
                        <select 
                          className="text-[10px] font-bold uppercase tracking-widest bg-black border border-zinc-700 text-white p-2 focus:outline-none focus:border-zinc-500 transition-colors"
                          value={u.role}
                          onChange={(e) => {
                            setUsers(users.map(user => user.id === u.id ? { ...user, role: e.target.value } : user));
                          }}
                        >
                          <option value="client">Client</option>
                          <option value="photographer">Photographer</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-zinc-800 pb-4">Pending Portfolio Approvals</h2>
          <div className="bg-black border border-zinc-800 p-8 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            No pending approvals currently.
          </div>
        </section>
      </div>
    </div>
  );
}
