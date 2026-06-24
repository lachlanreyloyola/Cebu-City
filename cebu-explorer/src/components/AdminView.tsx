import { useState, useEffect } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { ShieldAlert, Users, CalendarCheck, Clock, Check, X, ArrowLeft, RefreshCw } from 'lucide-react';

interface StatsData {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  users: any[];
}

interface AdminViewProps {
  user: any;
  onBackToDashboard: () => void;
}

export default function AdminView({ user, onBackToDashboard }: AdminViewProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Sync admin records
  const loadAdminData = async () => {
    try {
      setError('');
      // Load stats & users
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();

      // Load bookings
      const bookingsResponse = await fetch(`/api/bookings?userId=${user.id}&role=admin`);
      const bookingsData = await bookingsResponse.json();

      if (!statsResponse.ok || !bookingsResponse.ok) {
        throw new Error(statsData.error || bookingsData.error || 'Failed to retrieve administrative logs.');
      }

      setStats(statsData);
      setBookings(bookingsData.bookings || []);
    } catch (err: any) {
      setError(err.message || 'Connection to admin service failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  // Handle Approve/Reject triggers (UPDATE CRUD state)
  const handleUpdateStatus = async (bookingId: number, status: 'approved' | 'rejected') => {
    setActionLoadingId(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Status transition failed.');
      }

      // Sync booking in state
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
      
      // Re-trigger counter updates
      if (stats) {
        const isApproved = status === 'approved';
        setStats({
          ...stats,
          pendingBookings: Math.max(0, stats.pendingBookings - 1),
          approvedBookings: isApproved ? stats.approvedBookings + 1 : stats.approvedBookings
        });
      }
    } catch (err: any) {
      alert(err.message || 'Operation failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] py-8 px-[4%]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Navigation back and title */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToDashboard}
              className="inline-flex items-center justify-center p-2 rounded-none hover:bg-white border border-[#141414] text-[#141414] bg-[#F0EFEC] transition-all cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-serif italic font-bold text-2xl text-[#141414] flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-[#141414]" />
                <span>Administrative Control Center</span>
              </h1>
              <p className="text-xs text-[#141414] opacity-75 mt-0.5">Manage global accounts, approve or reject tours in real time.</p>
            </div>
          </div>

          <button 
            onClick={loadAdminData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-white text-xs text-[#141414] border border-[#141414] px-3.5 py-2 rounded-none font-bold hover:bg-[#F0EFEC] transition-all disabled:opacity-50 cursor-pointer uppercase font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Records</span>
          </button>
        </div>

        {error && (
          <div className="bg-white border border-[#141414] border-l-4 border-l-red-600 text-red-600 p-4 rounded-none text-xs font-mono mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-[#141414] font-mono text-xs">Synchronizing administrative databases...</div>
        ) : (
          <>
            {/* KPI Metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-none p-5 border border-[#141414] text-center">
                <div className="text-2xl font-bold font-mono text-[#141414]">{stats?.totalUsers || 0}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#141414] opacity-65 mt-1 font-mono">Active Accounts</div>
              </div>
              <div className="bg-white rounded-none p-5 border border-[#141414] text-center">
                <div className="text-2xl font-bold font-mono text-[#141414]">{stats?.totalBookings || 0}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#141414] opacity-65 mt-1 font-mono">Total Bookings</div>
              </div>
              <div className="bg-white rounded-none p-5 border border-[#141414] text-center">
                <div className="text-2xl font-bold font-mono text-red-600">{stats?.pendingBookings || 0}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-red-600 opacity-80 mt-1 font-mono">Pending Action</div>
              </div>
              <div className="bg-white rounded-none p-5 border border-[#141414] text-center">
                <div className="text-2xl font-bold font-mono text-[#141414] italic underline">{stats?.approvedBookings || 0}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#141414] opacity-65 mt-1 font-mono">Approved Trips</div>
              </div>
            </div>

            {/* Global Bookings Moderation section */}
            <h2 className="font-serif italic font-bold text-lg text-[#141414] mb-4 pb-1.5 border-b border-[#141414]">
              Manage Global Bookings
            </h2>
            <div className="bg-white rounded-none border border-[#141414] overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F0EFEC] text-[#141414] font-bold border-b border-[#141414] uppercase tracking-wider text-[10px] font-mono">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Traveler</th>
                      <th className="p-3.5">Destination</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Guests</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center p-10 text-[#141414] font-mono">No bookings registered in database.</td>
                      </tr>
                    ) : (
                      bookings.map(b => {
                        const dest = DESTINATIONS.find(d => d.id === b.destinationId);
                        const userAccount = stats?.users.find(u => u.id === b.userId);

                        return (
                          <tr key={b.id} className="border-b border-[#141414] hover:bg-[#F0EFEC]">
                            <td className="p-3.5 font-mono text-xs opacity-60">#{b.id}</td>
                            <td className="p-3.5">
                              <span className="font-bold text-[#141414] block">{userAccount?.name || 'Unknown User'}</span>
                              <span className="text-[10px] font-mono opacity-65">{userAccount?.email || 'N/A'}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-serif italic font-bold text-[#141414] block">{dest?.name || 'Deleted spot'}</span>
                              <span className="text-[10px] font-mono opacity-65">{dest?.location}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-medium block">{new Date(b.bookingDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                              <span className="text-[10px] font-mono opacity-65">{b.timeSlot}</span>
                            </td>
                            <td className="p-3.5 font-bold text-[#141414] font-mono">{b.guestCount} guest(s)</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-wider ${
                                b.status === 'approved' ? 'bg-green-100 border-[#141414] text-[#141414]' :
                                b.status === 'rejected' ? 'bg-red-100 border-red-500 text-red-600' : 'bg-[#141414] text-white border-[#141414]'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              {b.status === 'pending' ? (
                                <div className="flex justify-center gap-1.5">
                                  <button 
                                    onClick={() => handleUpdateStatus(b.id, 'approved')}
                                    disabled={actionLoadingId === b.id}
                                    className="p-1 border border-[#141414] bg-[#F0EFEC] hover:bg-green-100 text-[#141414] cursor-pointer disabled:opacity-50 rounded-none"
                                    title="Approve Booking"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(b.id, 'rejected')}
                                    disabled={actionLoadingId === b.id}
                                    className="p-1 border border-red-500 bg-[#F0EFEC] hover:bg-red-100 text-red-600 cursor-pointer disabled:opacity-50 rounded-none"
                                    title="Reject Booking"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] font-mono uppercase font-semibold text-[#141414] opacity-60">Archived</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users Accounts registry */}
            <h2 className="font-serif italic font-bold text-lg text-[#141414] mb-4 pb-1.5 border-b border-[#141414]">
              System Account Directory
            </h2>
            <div className="bg-white rounded-none border border-[#141414] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F0EFEC] text-[#141414] font-bold border-b border-[#141414] uppercase tracking-wider text-[10px] font-mono">
                      <th className="p-3.5">User ID</th>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Joined On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.users.map(u => (
                      <tr key={u.id} className="border-b border-[#141414] hover:bg-[#F0EFEC]">
                        <td className="p-3.5 font-bold text-[#141414] font-mono">#{u.id}</td>
                        <td className="p-3.5 font-bold text-[#141414]">{u.name}</td>
                        <td className="p-3.5 font-mono">{u.email}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-[#141414] text-white border-[#141414]' : 'bg-[#F0EFEC] text-[#141414] border-[#141414]'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#141414] opacity-75 font-mono">{new Date().toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
