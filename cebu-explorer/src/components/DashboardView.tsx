import React, { useState, useEffect } from 'react';
import { DESTINATIONS } from '../data/destinations';
import BookingForm from './BookingForm';
import { Calendar, Clock, Users, Edit3, Trash2, Shield, CalendarCheck } from 'lucide-react';

interface Booking {
  id: number;
  userId: number;
  destinationId: string;
  bookingDate: string;
  timeSlot: string;
  guestCount: number;
  specialRequests: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface DashboardViewProps {
  user: any;
  selectedDestinationId?: string;
  onSelectDestination: (destId: string | undefined) => void;
  onLogout: () => void;
  onAdminView: () => void;
}

export default function DashboardView({ user, selectedDestinationId, onSelectDestination, onLogout, onAdminView }: DashboardViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for updating a booking
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editGuests, setEditGuests] = useState(1);
  const [editRequests, setEditRequests] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Fetch bookings for this user
  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${user.id}&role=${user.role}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings list.');
      }
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to sync travel bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Handle booking cancelation (DELETE CRUD)
  const handleCancelBooking = async (bookingId: number) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking reservation?');
    if (!confirmCancel) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}?userId=${user.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel the booking.');
      }

      // Success
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove booking.');
    }
  };

  // Open Edit Dialog
  const openEditModal = (booking: Booking) => {
    setEditBooking(booking);
    setEditDate(booking.bookingDate);
    setEditTime(booking.timeSlot);
    setEditGuests(booking.guestCount);
    setEditRequests(booking.specialRequests);
    setEditError('');
  };

  const closeEditModal = () => {
    setEditBooking(null);
  };

  // Handle booking update save (UPDATE CRUD)
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBooking) return;
    setEditError('');
    setEditLoading(true);

    try {
      const response = await fetch(`/api/bookings/${editBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: editDate,
          timeSlot: editTime,
          guestCount: editGuests,
          specialRequests: editRequests,
          userId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update booking itinerary.');
      }

      // Sync local state
      setBookings(bookings.map(b => b.id === editBooking.id ? data.booking : b));
      closeEditModal();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update booking.');
    } finally {
      setEditLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#fdfaf3] pb-12">
      
      {/* Dashboard Sub Header */}
      <div className="bg-white border-b border-[rgba(6,59,84,0.08)] py-4.5 px-[4%] flex justify-between items-center flex-wrap gap-4 sticky top-14 z-40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[#5b6b76]">
            Welcome back, <strong className="text-[#063b54]">{user.name}</strong>
          </span>
          <span className="text-xs bg-[#ead9b8] text-[#063b54] px-2.5 py-0.5 rounded-full font-semibold capitalize">
            {user.role} Account
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button 
              onClick={onAdminView}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a6b8a] hover:text-[#1aa3c4] cursor-pointer border border-[#0a6b8a] px-3.5 py-1.5 rounded-full"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
          <button 
            onClick={onLogout}
            className="text-xs text-[#ff6f61] font-bold border border-[#ff6f61] hover:bg-[#ff6f61] hover:text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Logout Account
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Booking Form block (CREATE) */}
        <div className="md:col-span-2">
          <BookingForm 
            userId={user.id} 
            selectedDestinationId={selectedDestinationId} 
            onBookingAdded={() => {
              fetchBookings();
              onSelectDestination(undefined); // Clear page selector
            }}
          />
        </div>

        {/* Bookings Feed block (READ, UPDATE, DELETE) */}
        <div className="md:col-span-3">
          <h2 className="font-serif font-bold text-xl text-[#063b54] mb-5 pb-2 border-b-2 border-[#f6efe1] flex items-center gap-2">
            <CalendarCheck className="w-5.5 h-5.5 text-[#0a6b8a]" />
            <span>My Travel Itineraries</span>
          </h2>

          {loading ? (
            <div className="text-center py-16 text-[#5b6b76] text-sm">Loading bookings...</div>
          ) : error ? (
            <div className="bg-red-50 text-[#ff6f61] p-4 rounded-xl text-sm font-medium">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-[rgba(6,59,84,0.06)] shadow-sm">
              <span className="block text-3xl mb-3">🏖️</span>
              <p className="text-sm font-medium text-[#063b54] mb-1">No active travel bookings found.</p>
              <p className="text-xs text-[#5b6b76]">Select an adventure from the left sidebar to book your first Cebu trip!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map(b => {
                const dest = DESTINATIONS.find(d => d.id === b.destinationId);
                if (!dest) return null;

                return (
                  <div 
                    key={b.id}
                    className="bg-white rounded-2xl border border-[rgba(6,59,84,0.06)] p-5.5 flex flex-col sm:flex-row gap-5 items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={dest.imageUrl} 
                      alt={dest.name} 
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-serif font-bold text-[#063b54] text-base">{dest.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'approved' ? 'bg-[#e6f7ed] text-[#1f6f4a]' :
                          b.status === 'rejected' ? 'bg-[#ffebeb] text-[#ff6f61]' : 'bg-[#fff5e6] text-[#f6b042]'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-[#0a6b8a] font-medium mb-3">📍 {dest.location}</p>
                      
                      {/* Booking specifications */}
                      <div className="grid grid-cols-2 gap-2 text-[12px] text-[#5b6b76] mb-3.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Date: <strong>{new Date(b.bookingDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Slot: <strong>{b.timeSlot.split(' ')[0]}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Users className="w-3.5 h-3.5" />
                          <span>Guests: <strong>{b.guestCount} traveler(s)</strong></span>
                        </div>
                      </div>

                      {/* Special instructions */}
                      {b.specialRequests && (
                        <div className="text-[11px] bg-[#fdfaf3] text-[#5b6b76] p-2.5 rounded-lg border-l-2 border-[#1aa3c4] italic mb-4">
                          💬 "{b.specialRequests}"
                        </div>
                      )}

                      {/* CRUD Actions trigger */}
                      <div className="flex gap-2.5 mt-2 border-t border-[rgba(6,59,84,0.04)] pt-3">
                        <button 
                          onClick={() => openEditModal(b)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a6b8a] border border-[#0a6b8a] hover:bg-[#0a6b8a] hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Modify Travel</span>
                        </button>
                        <button 
                          onClick={() => handleCancelBooking(b.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff6f61] border border-[#ff6f61] hover:bg-[#ff6f61] hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Cancel Trip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* UPDATE DIALOG POPUP */}
      {editBooking && (
        <div className="fixed inset-0 z-50 bg-[#063b54]/40 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-white rounded-2xl p-6.5 max-w-[450px] w-full border border-[rgba(6,59,84,0.08)] shadow-[0_25px_60px_rgba(6,59,84,0.22)] relative">
            <button 
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-[#5b6b76] hover:text-[#063b54] font-bold text-xl cursor-pointer"
            >
              &times;
            </button>
            
            <h3 className="font-serif font-bold text-lg text-[#063b54] mb-4 pb-1.5 border-b border-[#f6efe1]">
              Modify Booking
            </h3>

            {editError && (
              <div className="bg-red-50 text-[#ff6f61] p-3 rounded-lg text-xs font-semibold mb-3">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveUpdate} className="flex flex-col gap-3.5">
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0c2230]">Travel Date</label>
                <input 
                  type="date" 
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  min={todayStr}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] text-xs outline-none focus:border-[#1aa3c4]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0c2230]">Preferred Time Slot</label>
                <select 
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] text-xs outline-none focus:border-[#1aa3c4]"
                  required
                >
                  <option value="05:00 AM - 08:00 AM">05:00 AM - 08:00 AM (Sunrise slots)</option>
                  <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning slots)</option>
                  <option value="01:00 PM - 05:00 PM">01:00 PM - 05:00 PM (Afternoon slots)</option>
                  <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM (Evening slots)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0c2230]">Number of Travelers</label>
                <input 
                  type="number" 
                  value={editGuests}
                  onChange={(e) => setEditGuests(parseInt(e.target.value) || 1)}
                  min="1"
                  max="50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] text-xs outline-none focus:border-[#1aa3c4]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0c2230]">Special Requests / Notes</label>
                <textarea 
                  value={editRequests}
                  onChange={(e) => setEditRequests(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] text-xs outline-none focus:border-[#1aa3c4] font-sans"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={editLoading}
                className="mt-2 w-full bg-gradient-to-r from-[#0a6b8a] to-[#1aa3c4] text-white py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {editLoading ? 'Saving changes...' : 'Save Booking Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
