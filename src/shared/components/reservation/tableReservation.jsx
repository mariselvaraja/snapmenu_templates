import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TableReservation() {
  const [selectedTable, setSelectedTable] = useState(6);
  const [selectedDate, setSelectedDate] = useState('22'); // Keep for backward compatibility
  const [dateValue, setDateValue] = useState(new Date()); // New Date object for DatePicker
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showAvailable, setShowAvailable] = useState(true);
  const [showBooked, setShowBooked] = useState(true);
  
  // Add animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Table data with hover state
  const [tables, setTables] = useState([
    { id: 1, type: 'rectangle-large', seats: 8, status: 'available' },
    { id: 2, type: 'rectangle-medium', seats: 6, status: 'available'},
    { id: 3, type: 'rectangle-small', seats: 6, status: 'available'},
    { id: 4, type: 'rectangle-small', seats: 4, status: 'available'},
    { id: 5, type: 'rectangle-small', seats: 4, status: 'booked'},
    { id: 6, type: 'round', seats: 4, status: 'available'},
    { id: 7, type: 'rectangle-large', seats: 10,status: 'booked'},
    { id: 8, type: 'rectangle-large', seats: 10,status: 'booked'},
  ]);

  // Date options with current month
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const dateOptions = [
    { day: '19', weekday: 'Sun', selected: false },
    { day: '20', weekday: 'Mon', selected: false },
    { day: '21', weekday: 'Tue', selected: false },
    { day: '22', weekday: 'Wed', selected: true },
    { day: '23', weekday: 'Thu', selected: false },
    { day: '24', weekday: 'Fri', selected: false },
  ];

  // Time options
  const timeOptions = [
    { time: '11:00', selected: false },
    { time: '13:00', selected: false },
    { time: '19:00', selected: true },
    { time: '21:00', selected: false },
  ];

  const handleTableSelect = (tableId) => {
    // Update tables to reflect new selection
    setTables(tables.map(table => ({
      ...table,
      status: table.id === tableId ? 'selected' : 
              table.status === 'selected' ? 'available' : 
              table.status
    })));
    setSelectedTable(tableId);
    setIsDrawerOpen(true); // Open the drawer when a table is selected
  };
  
  const handleTableHover = (tableId, isHovered) => {
    if (tables.find(t => t.id === tableId)?.status !== 'booked') {
      setTables(tables.map(table => ({
        ...table,
        isHovered: table.id === tableId ? isHovered : table.isHovered
      })));
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day);
  };
  
  const handleDateChange = (date) => {
    setDateValue(date);
    // Also update the selectedDate for backward compatibility
    setSelectedDate(date.getDate().toString());
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Render chair icons based on table position
  const renderChairs = (table) => {
    const chairPositions = {
      'rectangle-large': 8,
      'rectangle-medium': 6,
      'rectangle-small': 4,
      'round': 4
    };

    const chairCount = chairPositions[table.type];
    
    // Determine chair status based on table status and hover state
    const chairStatus = 
      table.status === 'selected' ? 'selected' : 
      table.status === 'booked' ? 'booked' : 
      table.isHovered ? 'hovered' : 'default';
    
    if (table.type === 'round') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Top chair */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out" style={{ transform: `translate(-50%, -50%) ${table.isHovered ? 'scale(1.1)' : ''}` }}>
              <ChairIcon status={chairStatus} />
            </div>
            {/* Right chair */}
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out" style={{ transform: `translate(50%, -50%) ${table.isHovered ? 'scale(1.1)' : ''}` }}>
              <ChairIcon status={chairStatus} />
            </div>
            {/* Bottom chair */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 transition-transform duration-300 ease-in-out" style={{ transform: `translate(-50%, 50%) ${table.isHovered ? 'scale(1.1)' : ''}` }}>
              <ChairIcon status={chairStatus} />
            </div>
            {/* Left chair */}
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out" style={{ transform: `translate(-50%, -50%) ${table.isHovered ? 'scale(1.1)' : ''}` }}>
              <ChairIcon status={chairStatus} />
            </div>
          </div>
        </div>
      );
    }

    // For rectangular tables
    const topChairs = [];
    const bottomChairs = [];
    
    for (let i = 0; i < chairCount / 2; i++) {
      topChairs.push(
        <div key={`top-${i}`} className="mx-1 transition-transform duration-300 ease-in-out" style={{ transform: table.isHovered ? 'scale(1.1)' : '' }}>
          <ChairIcon status={chairStatus} />
        </div>
      );
      
      bottomChairs.push(
        <div key={`bottom-${i}`} className="mx-1 transition-transform duration-300 ease-in-out" style={{ transform: table.isHovered ? 'scale(1.1)' : '' }}>
          <ChairIcon status={chairStatus} />
        </div>
      );
    }

    return (
      <>
        <div className="absolute top-0 left-0 right-0 flex justify-center transform -translate-y-3">
          {topChairs}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center transform translate-y-3">
          {bottomChairs}
        </div>
      </>
    );
  };

  // Group tables by seating capacity
  const tablesBySeating = {
    4: tables.filter(table => table.seats === 4),
    6: tables.filter(table => table.seats === 6),
    8: tables.filter(table => table.seats === 8),
    10: tables.filter(table => table.seats === 10)
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Filter options
  const filterOptions = ['All', '4', '6', '8', '10'];

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
  };

  // Get tables based on selected filter and availability checkboxes
  const getFilteredTables = () => {
    let filteredTables = selectedFilter === 'All' 
      ? tables 
      : tables.filter(table => table.seats === parseInt(selectedFilter));
    
    // Further filter based on availability checkboxes
    return filteredTables.filter(table => {
      if (table.status === 'booked' && !showBooked) return false;
      if (table.status !== 'booked' && !showAvailable) return false;
      return true;
    });
  };

  return (
    <div className={`relative flex flex-col md:flex-row gap-8 p-6 mx-auto transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Table selection area */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 border-b border-gray-200 pb-4">
          {/* Date and Time Selection - Combined in a single box */}
          {/* <div className="md:w-2/3 mb-4 md:mb-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"> */}
            <div><div>
              {/* <h3 className="text-lg font-medium mb-3 text-gray-600">Select Date & Time</h3> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {/* <label className="block text-sm font-medium text-gray-600 mb-1">Date</label> */}
                  <DatePicker
                    selected={dateValue}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all"
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select a date"
                  />
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-gray-600 mb-1">Time</label> */}
                  <div className="relative">
                    <select
                      value={selectedTime}
                      onChange={(e) => handleTimeSelect(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all appearance-none bg-white pr-10"
                    >
                      {timeOptions.map((time) => (
                        <option key={time.time} value={time.time}>
                          {time.time}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap space-x-2 mt-4 md:mt-0">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => handleFilterSelect(filter)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                  filter === selectedFilter
                    ? 'bg-orange-500 text-white font-medium shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter === 'All' ? 'All' : `${filter} Seater`}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8 overflow-y-auto pr-2 scroll-smooth">
          {selectedFilter === 'All' ? (
            /* All tables grouped by seating capacity */
            [4, 6, 8, 10].map(seatSize => (
              <div 
                key={seatSize} 
                className={`mb-8 pb-6 ${seatSize !== 10 ? 'border-b border-gray-200' : ''}`}
              >
                <h3 className="text-xl font-medium mb-4 sticky top-0 bg-white py-2 z-10 text-gray-700">
                  {seatSize} Seater Tables
                </h3>
              
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {tablesBySeating[seatSize].map((table) => {
                  // Determine table dimensions based on type (reduced size)
                  const tableDimensions = {
                    'rectangle-large': 'w-full h-20',
                    'rectangle-medium': 'w-full h-16',
                    'rectangle-small': 'w-full h-14',
                    'round': 'w-28 h-28 mx-auto'
                  };
                  
                  return (
                    <div 
                      key={table.id}
                      className="flex justify-center items-center"
                    >
                      <div 
                        className={`relative ${tableDimensions[table.type]} ${table.type === 'round' ? 'bg-gradient-to-br from-orange-50 to-white rounded-full' : 'bg-gradient-to-br from-white to-orange-50 rounded-xl'} border transition-all duration-300 ease-in-out ${table.status === 'booked' ? 'cursor-not-allowed' : 'cursor-pointer'}
                            ${table.status === 'booked' ? 'border-red-400 bg-gradient-to-br from-red-50 to-red-100 opacity-80 shadow-md' : 
                              table.status === 'selected' ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg' : 
                              table.status === 'available' ? 'border-orange-300 shadow-md' :
                              table.isHovered ? 'border-orange-400 ring-2 ring-orange-200 shadow-lg scale-105' : 'border-orange-200'}`}
                        onClick={() => table.status !== 'booked' && handleTableSelect(table.id)}
                        onMouseEnter={() => handleTableHover(table.id, true)}
                        onMouseLeave={() => handleTableHover(table.id, false)}
                      >
                        {renderChairs(table)}
                        
                        <div className="flex justify-center items-center h-full z-10">
                          {/* Show table number with BOOKED status for booked tables */}
                          {table.status === 'booked' ? (
                            <span className="bg-red-50 text-red-500 text-xs font-medium tracking-wide uppercase px-3 py-1 rounded-md shadow-sm border border-red-100">
                              Table {table.id} • Reserved
                            </span>
                          ) : (
                            <span className="text-xs font-medium tracking-wide uppercase text-gray-600 bg-white bg-opacity-80 px-3 py-1 rounded-md shadow-sm border border-gray-100">Table {table.id}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                  })}
                  
                  {/* No tables message if none in this section */}
                  {tablesBySeating[seatSize].length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500">
                      No tables available with {seatSize} seats.
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            /* Filtered tables by selected seater type */
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {getFilteredTables().map((table) => {
                  // Determine table dimensions based on type (reduced size)
                  const tableDimensions = {
                    'rectangle-large': 'w-full h-20',
                    'rectangle-medium': 'w-full h-16',
                    'rectangle-small': 'w-full h-14',
                    'round': 'w-28 h-28 mx-auto'
                  };
                  
                  return (
                    <div 
                      key={table.id}
                      className="flex justify-center items-center"
                    >
                      <div 
                        className={`relative ${tableDimensions[table.type]} ${table.type === 'round' ? 'bg-gradient-to-br from-orange-50 to-white rounded-full' : 'bg-gradient-to-br from-white to-orange-50 rounded-xl'} border transition-all duration-300 ease-in-out ${table.status === 'booked' ? 'cursor-not-allowed' : 'cursor-pointer'}
                            ${table.status === 'booked' ? 'border-red-400 bg-gradient-to-br from-red-50 to-red-100 opacity-80 shadow-md' : 
                              table.status === 'selected' ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg' : 
                              table.status === 'available' ? 'border-orange-300 shadow-md' :
                              table.isHovered ? 'border-orange-400 ring-2 ring-orange-200 shadow-lg scale-105' : 'border-orange-200'}`}
                        onClick={() => table.status !== 'booked' && handleTableSelect(table.id)}
                        onMouseEnter={() => handleTableHover(table.id, true)}
                        onMouseLeave={() => handleTableHover(table.id, false)}
                      >
                        {renderChairs(table)}
                        
                        <div className="flex justify-center items-center h-full z-10">
                          {/* Show table number with BOOKED status for booked tables */}
                          {table.status === 'booked' ? (
                            <span className="bg-red-50 text-red-500 text-xs font-medium tracking-wide uppercase px-3 py-1 rounded-md shadow-sm border border-red-100">
                              Table {table.id} • Reserved
                            </span>
                          ) : (
                            <span className="text-xs font-medium tracking-wide uppercase text-gray-600 bg-white bg-opacity-80 px-3 py-1 rounded-md shadow-sm border border-gray-100">Table {table.id}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* No tables message if none in this section */}
                {getFilteredTables().length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    No tables available with {selectedFilter} seats.
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Way In label */}
          {/* <div className="mt-8 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-8 border-t-2 border-l-2 border-r-2 border-orange-400 rounded-t-lg bg-orange-50"></div>
              <span className="text-xs text-gray-500 mt-1 font-medium">Way In</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Booking details drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-[50%] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header with close button */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Book your table</h2>
          <button 
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3 text-gray-600">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Reservation Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2 text-gray-600">Reservation Summary</h3>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              {/* Table info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
                    {selectedTable}
                  </div>
                  <span className="text-gray-700 font-medium">Table {selectedTable}</span>
                </div>
                <ChairIcon status="selected" />
              </div>
              
              {/* Date and time summary */}
              <div className="grid grid-cols-2 gap-4 mb-4 bg-white p-3 rounded-md border border-orange-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-700">{dateValue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Time</p>
                  <p className="font-medium text-gray-700">{selectedTime}</p>
                </div>
              </div>
              
              {/* QR Code for selected table */}
              <div className="mt-4 flex flex-col items-center">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                  <QRCode 
                    value={`TABLE:${selectedTable}|DATE:${dateValue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}|TIME:${selectedTime}`}
                    size={150}
                    level="M"
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Scan this QR code at the restaurant to confirm your reservation
                </p>
              </div>
            </div>
          </div>

          {/* Book now button */}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
            Book Now
          </button>

          {/* Legend */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Legend</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center bg-white p-2 rounded shadow-sm">
                <ChairIcon status="default" />
                <span className="ml-2 text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center bg-white p-2 rounded shadow-sm">
                <ChairIcon status="booked" />
                <span className="ml-2 text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center bg-white p-2 rounded shadow-sm">
                <ChairIcon status="selected" />
                <span className="ml-2 text-sm text-gray-600">Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay when drawer is open */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeDrawer}
        ></div>
      )}
    </div>
  );
}

// Chair icon component with more elegant design
function ChairIcon({ status = 'default' }) {
  const statusClasses = {
    default: 'text-orange-300',
    booked: 'text-red-500',
    selected: 'text-orange-600',
    hovered: 'text-orange-400'
  };

  return (
    <svg 
      className={`w-6 h-6 ${statusClasses[status]} drop-shadow-md transition-all duration-300 ease-in-out`} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* More elegant chair design */}
      <path d="M19 9.5C19 7.01472 16.9853 5 14.5 5H9.5C7.01472 5 5 7.01472 5 9.5V11H7.5V16.5C7.5 17.0523 7.94772 17.5 8.5 17.5H9.5C10.0523 17.5 10.5 17.0523 10.5 16.5V11H13.5V16.5C13.5 17.0523 13.9477 17.5 14.5 17.5H15.5C16.0523 17.5 16.5 17.0523 16.5 16.5V11H19V9.5Z" />
      <path d="M8 9.5C8 8.67157 8.67157 8 9.5 8H14.5C15.3284 8 16 8.67157 16 9.5V10H8V9.5Z" fillOpacity="0.4" />
    </svg>
  );
}
