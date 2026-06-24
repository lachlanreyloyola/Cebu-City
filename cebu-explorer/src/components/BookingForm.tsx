import React, { useState, useEffect } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { Calendar, Users, Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  userId: number;
  selectedDestinationId?: string;
  onBookingAdded: () => void;
}

export default function BookingForm({ userId, selectedDestinationId, onBookingAdded }: BookingFormProps) {
  const [destinationId, setDestinationId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('01:00 PM - 05:00 PM');
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Set selected destination if triggered from landing page card click
  useEffect(() => {
    if (selectedDestinationId) {
      setDestinationId(selectedDestinationId);
    }
  }, [selectedDestinationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!destinationId || !bookingDate || !timeSlot || guestCount < 1) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          destinationId,
          bookingDate,
          timeSlot,
          guestCount,
          specialRequests
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit travel booking.');
      }

      setSuccess('Your adventure booking request has been submitted successfully! Check status on the side.');
      setDestinationId('');
      setBookingDate('');
      setSpecialRequests('');
      setGuestCount(1);
      onBookingAdded(); // Reload bookings feed in the dashboard list
    } catch (err: any) {
      setError(err.message || 'Failed to post booking.');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl p-6.5 shadow-[0_4px_14px_rgba(6,59,84,0.06)] border border-[rgba(6,59,84,0.06)] flex flex-col">
      <h2 className="text-[#063b54] font-serif font-bold text-xl mb-5 pb-2 border-b-2 border-[#f6efe1]">
        Book a New Adventure
      </h2>

      {/* Success alert */}
      {success && (
        <div className="flex items-start gap-2 bg-[#ebfbeb] border border-green-200 text-[#1f6f4a] rounded-xl p-3.5 text-[13px] mb-5 font-semibold">
          <CheckCircle className="w-4.5 h-4.5 shrink-0 text-green-600 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="flex items-start gap-2 bg-[#ffebeb] border border-red-200 text-[#ff6f61] rounded-xl p-3.5 text-[13px] mb-5 font-semibold">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Destination drop-down selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#0c2230]">Select Destination</label>
          <select 
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="w-full bg-white px-4 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] outline-none focus:border-[#1aa3c4] transition-all text-[13px] font-medium"
            required
          >
            <option value="">-- Choose Destination --</option>
            {DESTINATIONS.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name} ({dest.location})
              </option>
            ))}
          </select>
        </div>

        {/* Booking date selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#0c2230]">Preferred Date</label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-[#5b6b76]" />
            <input 
              type="date" 
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={todayStr}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] outline-none focus:border-[#1aa3c4] transition-all text-[13px]"
              required
            />
          </div>
        </div>

        {/* Time slot selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#0c2230]">Preferred Time Slot</label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#5b6b76]" />
            <select 
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[rgba(6,59,84,0.12)] outline-none focus:border-[#1aa3c4] transition-all text-[13px] font-medium"
              required
            >
              <option value="05:00 AM - 08:00 AM">05:00 AM - 08:00 AM (Sunrise slots)</option>
              <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning slots)</option>
              <option value="01:00 PM - 05:00 PM">01:00 PM - 05:00 PM (Afternoon slots)</option>
              <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM (Evening slots)</option>
            </select>
          </div>
        </div>

        {/* Guest count input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#0c2230]">Number of Travelers</label>
          <div className="relative">
            <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-[#5b6b76]" />
            <input 
              type="number" 
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              min="1"
              max="50"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] outline-none focus:border-[#1aa3c4] transition-all text-[13px]"
              required
            />
          </div>
        </div>

        {/* Special instructions textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#0c2230]">Special Instructions / Requests</label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-[#5b6b76]" />
            <textarea 
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              placeholder="Dietary requests, hotel pickup details, etc..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(6,59,84,0.12)] outline-none focus:border-[#1aa3c4] transition-all text-[13px] font-sans"
            ></textarea>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 w-full bg-gradient-to-r from-[#063b54] to-[#0a6b8a] text-white py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all hover:brightness-110 shadow-sm"
        >
          {loading ? 'Submitting Booking...' : 'Confirm Booking Request'}
        </button>
      </form>
    </div>
  );
}
