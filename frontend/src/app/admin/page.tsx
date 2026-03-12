'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface Stats {
  activeUsers: number;
  totalUsers: number;
  totalSessions: number;
  totalReports: number;
  totalBans: number;
}

interface UserRow {
  uid: string;
  displayName: string;
  email: string;
  country?: string;
  isOnline: boolean;
  isBanned: boolean;
  totalChats: number;
  createdAt: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [banUid, setBanUid] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banMsg, setBanMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/users?limit=30'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data.users || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 10_000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleBan = async () => {
    if (!banUid.trim()) return;
    try {
      await api.post(`/api/admin/ban/${banUid.trim()}`, { reason: banReason || 'Admin ban' });
      setBanMsg(`✅ User ${banUid} banned.`);
      setBanUid('');
      setBanReason('');
    } catch {
      setBanMsg('❌ Failed to ban user.');
    }
  };

  const handleUnban = async (uid: string) => {
    try {
      await api.post(`/api/admin/unban/${uid}`);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, isBanned: false } : u)));
    } catch { /* ignore */ }
  };

  return (
    <div className="gradient-bg min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Signed in as {user?.displayName || user?.email}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400 glass px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 h-24 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatCard label="Active Now" value={stats.activeUsers} color="text-green-400" />
            <StatCard label="Total Users" value={stats.totalUsers} color="text-violet-400" />
            <StatCard label="Sessions" value={stats.totalSessions} color="text-cyan-400" />
            <StatCard label="Reports" value={stats.totalReports} color="text-amber-400" />
            <StatCard label="Bans" value={stats.totalBans} color="text-red-400" />
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Users Table ── */}
          <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-white font-semibold">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-center">Chats</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white font-medium truncate max-w-[120px]">{u.displayName}</td>
                      <td className="px-4 py-3 text-white/50 truncate max-w-[140px]">{u.email}</td>
                      <td className="px-4 py-3 text-center text-white/60">{u.totalChats}</td>
                      <td className="px-4 py-3 text-center">
                        {u.isBanned ? (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Banned</span>
                        ) : u.isOnline ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Online</span>
                        ) : (
                          <span className="text-xs bg-white/5 text-white/30 px-2 py-0.5 rounded-full">Offline</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.isBanned ? (
                          <button
                            onClick={() => handleUnban(u.uid)}
                            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => setBanUid(u.uid)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-white/30 text-sm">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Ban User Form ── */}
          <div className="glass rounded-2xl p-5 space-y-4 h-fit">
            <h2 className="text-white font-semibold">Ban a User</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">User UID</label>
                <input
                  type="text"
                  value={banUid}
                  onChange={(e) => setBanUid(e.target.value)}
                  placeholder="Firebase UID"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block">Reason</label>
                <input
                  type="text"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Inappropriate behavior"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <button
                onClick={handleBan}
                className="w-full py-2.5 bg-red-500/80 hover:bg-red-500 rounded-xl text-white text-sm font-semibold transition-colors"
              >
                Ban User
              </button>
              {banMsg && (
                <p className="text-sm text-center text-white/60">{banMsg}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}
