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

const BillComponent: React.FC<BillComponentProps> = ({ onClose, order }) => {

  const tableNumber = sessionStorage.getItem("table_number");
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
  
  // Function to format date in the exact format: YYYY-MM-DD HH-MM-SS
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
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
          <title>Bill</title>
          <style>
            body {
              font-family: monospace;
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .table-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
              text-align: center;
            }
            .bill-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .items-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              border-top: 1px dashed #000;
              padding-top: 10px;
              margin-top: 10px;
            }
            .thank-you {
              text-align: center;
              margin-top: 30px;
            }
            .divider {
              border-bottom: 1px dashed #000;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="table-name">${tableNumber ? `${tableNumber} seater table No1` : 'No Table'}</div>
          
          <div class="bill-info">
            <div>Order #: ${order.id}</div>
            <div>${formatDate(order.date)}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="items-header">
            <div>Item</div>
            <div style="display: flex;">
              <div style="width: 60px; text-align: center;">Qty</div>
              <div style="width: 80px; text-align: right;">Price</div>
            </div>
          </div>
          
          ${order.items.map(item => `
            <div class="item-row">
              <div>${item.name}</div>
              <div style="display: flex;">
                <div style="width: 60px; text-align: center;">${item.quantity}x</div>
                <div style="width: 80px; text-align: right;">$${item.price.toFixed(2)}</div>
              </div>
            </div>
          `).join('')}
          
          <div class="divider"></div>
          
          <div class="total-row">
            <div>TOTAL</div>
            <div>$${order.total.toFixed(2)}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="thank-you">Thank you!</div>
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
          {/* Table Name */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{tableNumber ? `${tableNumber} seater table No1` : 'No Table'}</h1>
          </div>
          
          {/* Bill Info */}
          <div className="text-sm mb-6 border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <p><span className="font-medium">Order #:</span> {order.id}</p>
              <p>{formatDate(order.date)}</p>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mb-6">
            <div className="border-b border-gray-200 pb-2 mb-2">
              <div className="flex justify-between">
                <span className="font-medium">Item</span>
                <div className="flex">
                  <span className="font-medium w-16 text-center">Qty</span>
                  <span className="font-medium w-20 text-right">Price</span>
                </div>
              </div>
            </div>
            
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.name}</span>
                <div className="flex">
                  <span className="w-16 text-center">{item.quantity}x</span>
                  <span className="w-20 text-right">${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Thank you message */}
          <div className="text-center mt-6 text-gray-600">
            <p>Thank you!</p>
          </div>
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default BillComponent;
