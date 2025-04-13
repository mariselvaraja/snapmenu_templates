import React from 'react';
import { useReservation } from '../../../context/contexts/ReservationContext';
import { format, parse } from 'date-fns';
import { Clock } from 'lucide-react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export function TimeSelector({ selectedTime, onTimeSelect, selectedDate }) {
  const { timeSlots, loading } = useReservation();

  const formatTime = (time) => {
    try {
      // Handle both HH:mm:ss and HH:mm formats
      const timeFormat = time.includes(':') && time.split(':').length === 3 ? 'HH:mm:ss' : 'HH:mm';
      const parsed = parse(time, timeFormat, new Date());
      return format(parsed, 'h:mm a');
    } catch (error) {
      console.error('Error parsing time:', time, error);
      return time; // Return original time as fallback
    }
  };

  // Filter available time slots
  const availableTimeSlots = timeSlots.filter(slot => slot.available);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (timeSlots.length === 0 || availableTimeSlots.length === 0) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">
          No available times for the selected date and party size.
        </p>
        <p className="text-gray-500 mt-2">
          Please try another date or party size, or call us directly for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedDate && (
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <p>Selected date: {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</p>
        </div>
      )}
      
      <select
        value={selectedTime || ''}
        onChange={(e) => onTimeSelect(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <option value="">Select a time</option>
        {availableTimeSlots.map((slot) => (
          <option key={slot.time} value={slot.time}>
            {formatTime(slot.time)}
          </option>
        ))}
      </select>
      
      <div className="mt-2 text-sm text-gray-500">
        <p>Please select a time for your reservation</p>
      </div>
    </div>
  );
}
