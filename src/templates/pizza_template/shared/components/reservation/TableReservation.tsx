import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, Users, Check, Loader2, Cross } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTableAvailablityRequest } from '../../../../../common/redux/slices/tableAvailabilitySlice'
import { RootState } from '../../../../../common/redux/rootReducer';
import _ from 'lodash';
import { makeReservationRequest, resetReservationState } from '@/common/redux/slices/makeReservationSlice';
import { CiWarning } from 'react-icons/ci';

interface TableReservationProps {
  onBookingComplete?: (bookingData: BookingData) => void;
  initialDate?: string;
  initialTime?: string;
  reservationContent: {
    form: {
      labels: {
        name: string;
      };
    };
  };
  restaurantInfo?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    operatingHours: {
      day: string;
      hours: string;
    }[];
  };
}

export interface BookingData {
  partySize: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  specialRequest: string;
}

export default function TableReservation({ 
  onBookingComplete,
  initialDate,
  initialTime, 
  restaurantInfo = {
    name: "Pizza Restaurant",
    phone: "+1 (555) 123-4569",
    email: "info@pizzarestaurant.com",
    address: "123 Main Street, Anytown, USA",
    operatingHours: [
      { day: "Monday - Thursday", hours: "11:00 AM - 10:00 PM" },
      { day: "Friday - Saturday", hours: "11:00 AM - 11:00 PM" },
      { day: "Sunday", hours: "12:00 PM - 9:00 PM" }
    ]
  }
}: TableReservationProps) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(initialDate || ''); 
  const [selectedTime, setSelectedTime] = useState(initialTime || '');
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const { items, time_slots, loading: tableLoading, error: tableError } = useSelector((state: RootState) => state.tableAvailability);
  const { loading: reservationLoading, success: reservationSuccess, reservationData } = useSelector((state: RootState) => state.makeReservation);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  useEffect(() => {
    dispatch(fetchTableAvailablityRequest({date : selectedDate}));
  }, [selectedDate]);

  // Reset success state when component mounts (e.g., when navigating from navbar)
  useEffect(() => {
    setShowSuccessPopup(false);
    dispatch(resetReservationState());
  }, []);

  useEffect(() => {
    if (reservationSuccess && reservationData) {
      setShowSuccessPopup(true);
      window.scroll(0,0);
      // Success screen will stay open until user manually closes it
    }
  }, [reservationSuccess, reservationData, dispatch]);

   // Log restaurant info for debugging
  useEffect(() => {
    if (time_slots) {
      setTimeSlots(formatStartTimesToEST(time_slots))
    }
  }, [time_slots]);
  
  const formatStartTimesToEST = (data: any): string[] =>  {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      // timeZone: 'America/New_York'
    });

    const formatedTimes = _.map(data, item => {
      const date = new Date(item.start_time.replace(' ', 'T'));
      return formatter.format(date);
    });

    // Check if selected date is today
    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;

    // If selected date is today, filter out past time slots
    if (isToday) {
      const now = new Date();
      const newyarkNow = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      );
      const newyarkCurrentTimeSlot = formatter.format(newyarkNow);

      return _.filter(formatedTimes, time =>{
        return time >= newyarkCurrentTimeSlot;
      });
    }

    // If selected date is a future date, return all formatted times
    return formatedTimes;
  }



  // Available party sizes
  const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
  
  // Time slots for the time selector
  //const timeSlots = ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  const handleBooking = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    function getStartAndEndTime(dateStr:any, timeStr:any) {
      // If no time is selected, use a default time (e.g., 7:00 PM)
      const defaultTime = timeStr || '7:00 PM';
      const [time, meridian] = defaultTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
    
      // Convert to 24-hour format
      if (meridian?.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
      } else if (meridian?.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
    
      // Create Date object using local time
      const [year, month, day] = dateStr.split('-').map(Number);
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
    
      // Format as YYYY-MM-DD HH:mm:ss
      const format = (d:any) => {
        const pad = (n:any) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };
    
      return {
        startTime: format(start),
        endTime: format(end),
      };
    }

    

    let restaurant_id = sessionStorage.getItem('franchise_id');
    let restaurant_parent_id = sessionStorage.getItem('restaurant_id');
    
    let date = getStartAndEndTime(selectedDate, selectedTime)
    // Create the payload with the required format
    const reservationPayload = {
      restaurant_id,
      restaurant_parent_id,
      party_size: partySize,
      customer_name: name,
      phone: phone,
      email: email,
      reservation_start_time: date.startTime,
      reservation_end_time: date.endTime
    };
    

    dispatch(makeReservationRequest(reservationPayload))

  };

  // Generate time slots based on operating hours
  const generateTimeSlots = () => {
    // Extract operating hours for the current day
    const today = new Date(selectedDate || new Date()).getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[today];
    
    // Find the matching operating hours
    let operatingHoursForDay = restaurantInfo.operatingHours.find(
      item => item.day.includes(dayName)
    );
    
    // Default to first entry if no match found
    if (!operatingHoursForDay) {
      operatingHoursForDay = restaurantInfo.operatingHours[0];
    }
    
    // Parse hours string to get opening and closing times
    const hoursMatch = operatingHoursForDay.hours.match(/(\d+):(\d+)\s+(AM|PM)\s+-\s+(\d+):(\d+)\s+(AM|PM)/);
    if (!hoursMatch) return [];
    
    const [_, openHour, openMin, openAmPm, closeHour, closeMin, closeAmPm] = hoursMatch;
    
    // Convert to 24-hour format for calculations
    let startHour = parseInt(openHour);
    if (openAmPm === 'PM' && startHour !== 12) startHour += 12;
    if (openAmPm === 'AM' && startHour === 12) startHour = 0;
    
    let endHour = parseInt(closeHour);
    if (closeAmPm === 'PM' && endHour !== 12) endHour += 12;
    if (closeAmPm === 'AM' && endHour === 12) endHour = 0;
    
    // Generate hourly slots
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const h = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      slots.push(`${h}:00 ${ampm}`);
      // Add half-hour slots if desired
      // slots.push(`${h}:30 ${ampm}`);
    }
    
    return slots;
  };



  // Show loading indicator when table availability is being fetched
  if (tableLoading) {
    return (
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 mx-auto max-w-full"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Loading state for table availability */}
            <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="text-center mb-4">
                <Loader2 className="w-12 h-12 text-red-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Checking Table Availability</h3>
                <p className="text-gray-600 mb-4">
                  Please wait while we check available time slots for your selected date...
                </p>
              </div>
              
              {/* Date Field - Show selected date while loading */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label htmlFor="date" className="block text-md font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block mr-2 h-5 w-5 text-red-500" /> Selected Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                  required
                />
              </div>
              
              <div className="mt-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="h-10 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 mx-auto max-w-full"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Reservation Form */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Make a Reservation</h2>
            
            <form onSubmit={handleBooking} className="space-y-6">
            
              <div className="grid grid-cols-2 gap-4">
       
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Names
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                {/* Party Size Field */}
                <div>
                  <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 mb-1">
                    <Users className="inline-block mr-1 h-4 w-4" /> Party Size
                  </label>
                  <select
                    id="partySize"
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    {partySizes.map(size => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Date Field */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline-block mr-1 h-4 w-4" /> Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block mr-1 h-4 w-4" /> Preferred Time
                </label>
                
                {timeSlots && timeSlots.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">Select your preferred time slot (click again to deselect):</p>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(selectedTime === time ? '' : time)}
                          className={`py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                            selectedTime === time
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {selectedTime && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Selected:</strong> {selectedTime} - Click the time again to deselect, or choose a different time.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>No specific time slots available for this date.</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Don't worry! You can still make a reservation. We'll use a default time (7:00 PM) 
                      and our team will contact you to confirm the best available time that works for you.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Phone and Email - 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Phone Number Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline-block mr-1 h-4 w-4" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline-block mr-1 h-4 w-4" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              
              {/* Special Request Field */}
              <div>
                <label htmlFor="specialRequest" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Request
                </label>
                <textarea
                  id="specialRequest"
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Any special requests or notes"
                  rows={3}
                />
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={reservationLoading || (timeSlots && timeSlots.length > 0 && !selectedTime)}
                className={`w-full ${
                  reservationLoading || (timeSlots && timeSlots.length > 0 && !selectedTime)
                    ? 'bg-red-400 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white py-3 px-4 rounded-md font-semibold transition-colors shadow-sm hover:shadow-md mt-6 flex items-center justify-center`}
              >
                {reservationLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (timeSlots && timeSlots.length > 0 && !selectedTime) ? (
                  'Please Select a Time Slot'
                ) : (
                  'Reserve Table'
                )}
              </button>
            </form>
          </div>
          
          {/* Right side - Restaurant Information */}
          <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Restaurant Information</h2>
            
            {/* Contact Information */}
            {/* <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Phone className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                  <span>{restaurantInfo.phone}</span>
                </div>
                <div className="flex items-start">
                  <Mail className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                  <span>{restaurantInfo.email}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-red-500 mr-3 mt-1 flex-shrink-0" size={18} />
                  <span>{restaurantInfo.address}</span>
                </div>
              </div>
            </div> */}
            
            {/* Operating Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Operating Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                {restaurantInfo.operatingHours.map((item, index) => (
                  <div key={index} className="flex flex-col border border-gray-200 rounded-md p-3 bg-white">
                    <span className="font-medium text-gray-800">{item.day}</span>
                    <span className="text-gray-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Information */}
            {/* <div className="mt-8 p-4 bg-yellow-50 rounded-md border border-yellow-100">
              <h4 className="font-medium text-yellow-800 mb-2">Reservation Policy</h4>
              <p className="text-sm text-yellow-700">
                Reservations are held for 15 minutes past the scheduled time. For parties of 8 or more, 
                please call us directly. A credit card may be required for larger reservations.
              </p>
            </div> */}
          </div>
        </div>

        {/* Success Popup Modal */}
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowSuccessPopup(false);
              dispatch(resetReservationState());
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
            
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {JSON.parse(reservationData)?.message?.toLowerCase()?.includes("table booked") ? 
                    <Check className="h-12 w-12 text-green-500" /> : 
                    <CiWarning className="h-12 w-12 text-red-500" />
                  }
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {JSON.parse(reservationData)?.message}
                </h3>
                
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    dispatch(resetReservationState());
                    // Reset form for new reservation
                    setName('');
                    setPhone('');
                    setEmail('');
                    setSpecialRequest('');
                    setSelectedTime('');
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md font-semibold transition-colors"
                >
                  Make Another Reservation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
