import React from 'react';
import { X, Download, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../common/store';
import { useAppSelector } from '../../../../common/redux';
import { motion } from 'framer-motion';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface BillComponentProps {
  onClose: () => void;
  order: Order;
  tableNumber: string | null;
}

const BillComponent: React.FC<BillComponentProps> = ({ onClose, order, tableNumber }) => {
  const restaurant = useSelector((state: RootState) => state.restaurant.info);
  
  // Get site content from Redux state for brand name and contact info
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const siteContent = rawApiResponse?.data ? 
    (typeof rawApiResponse.data === 'string' ? JSON.parse(rawApiResponse.data) : rawApiResponse.data) : 
    {};
  
  // Get brand name from navigation bar
  const navigationBar = siteContent?.navigationBar || { brand: { name: 'Restaurant' }, navigation: { links: [] } };
  const { brand } = navigationBar;
  
  // Get contact information
  const contact = siteContent?.contact || {
    infoCards: {
      phone: {
        numbers: ["(212) 555-1234"],
      },
      email: {
        addresses: ["info@chrisrestaurant.com"],
      },
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
      hours: {
        weekday: "Mon-Thu: 5pm-10pm",
        weekend: "Fri-Sat: 5pm-11pm",
      }
    }
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to handle bill download
  const handleDownload = () => {
    // Create a printable version of the bill
    const printContent = document.getElementById('bill-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${brand?.name || 'Restaurant'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .bill-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items th, .items td {
              border-bottom: 1px solid #eee;
              padding: 10px;
              text-align: left;
            }
            .items th {
              background-color: #f9f9f9;
            }
            .total-row {
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>${contact?.infoCards?.phone?.numbers?.[0] || ''} | ${contact?.infoCards?.email?.addresses?.[0] || ''}</p>
            <p>${brand?.name || 'Restaurant'}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Print the window
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.close();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Bill Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Bill Details</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Download Bill"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bill Content */}
        <div className="p-4" id="bill-content">
          {/* Restaurant Info */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">{brand?.name || 'Restaurant Name'}</h1>
            <p className="text-sm text-gray-600">
              {contact?.infoCards?.address?.street || ''}{contact?.infoCards?.address?.city ? `, ${contact.infoCards.address.city}` : ''}
              {contact?.infoCards?.address?.state ? `, ${contact.infoCards.address.state}` : ''}
              {contact?.infoCards?.address?.zip ? ` ${contact.infoCards.address.zip}` : ''}
            </p>
            {contact?.infoCards?.phone?.numbers && contact.infoCards.phone.numbers.length > 0 && (
              <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                <Phone className="h-3 w-3 mr-1" />
                <span>{contact.infoCards.phone.numbers[0]}</span>
              </div>
            )}
            {contact?.infoCards?.email?.addresses && contact.infoCards.email.addresses.length > 0 && (
              <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                <Mail className="h-3 w-3 mr-1" />
                <span>{contact.infoCards.email.addresses[0]}</span>
              </div>
            )}
          </div>
          
          {/* Bill Info */}
          <div className="flex justify-between text-sm mb-6 border-b border-gray-200 pb-4">
            <div>
              <p><span className="font-medium">Order #:</span> {order.id}</p>
              <p><span className="font-medium">Date:</span> {formatDate(order.date)}</p>
            </div>
            <div>
              <p><span className="font-medium">Table:</span> {tableNumber ? `#${tableNumber}` : 'No Table'}</p>
              <p><span className="font-medium">Status:</span> {order.status}</p>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Order Items</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-3">Item</th>
                  <th className="text-center py-2 px-3">Qty</th>
                  <th className="text-right py-2 px-3">Price</th>
                  <th className="text-right py-2 px-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-3">{item.name}</td>
                    <td className="py-2 px-3 text-center">{item.quantity}</td>
                    <td className="py-2 px-3 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Bill Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${(order.total / 1.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (10%)</span>
              <span>${(order.total - (order.total / 1.1)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default BillComponent;
