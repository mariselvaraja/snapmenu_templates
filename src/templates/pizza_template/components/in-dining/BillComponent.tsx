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
  modifiers?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
  spiceLevel?: string | null;
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
  order: Order[] | Order;
  tableNumber: string | null;
}

const BillComponent: React.FC<BillComponentProps> = ({ onClose, order }) => {
  // Convert single order to array if needed
  const orders = Array.isArray(order) ? order : [order];
  
  // Calculate total amount from all orders
  const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const tableNumber = sessionStorage.getItem("table_number");
  const restaurant = useSelector((state: RootState) => state.restaurant.info);
  let tablename = sessionStorage.getItem('Tablename');
  
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
  
  // Function to format date in Month-day-year format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // If date is invalid, use current date
        const currentDate = new Date();
        return currentDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
      
      // Format date as Month day, year (e.g., "May 6, 2025")
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      // If there's any error, return current date
      const currentDate = new Date();
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
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
          <div class="table-name">${tablename}</div>
          
          <div class="bill-info">
            <div>Order #: ${orders.length > 0 ? orders[0].id : 'N/A'}</div>
            <div>${orders.length > 0 ? formatDate(orders[0].date) : new Date().toISOString()}</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="items-header">
            <div>Item</div>
            <div style="display: flex;">
              <div style="width: 60px; text-align: center;">Qty</div>
              <div style="width: 80px; text-align: right;">Price</div>
            </div>
          </div>
          
          ${orders.map(order => 
            order.items && order.items.map((item: OrderItem) => `
              <div style="margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 10px;">
                <div class="item-row">
                  <div><strong>${item.name}</strong></div>
                  <div style="display: flex;">
                    <div style="width: 60px; text-align: center;">${item.quantity}x</div>
                    <div style="width: 80px; text-align: right;">$${item.price.toFixed(2)}</div>
                  </div>
                </div>
                
                ${item.spiceLevel ? `
                  <div style="font-size: 12px; margin-top: 5px;">
                    <strong>Spice Level:</strong> ${item.spiceLevel}
                  </div>
                ` : ''}
                
                ${item.modifiers && item.modifiers.length > 0 ? `
                  <div style="font-size: 12px; margin-top: 5px;">
                    <strong>Modifiers:</strong>
                    <ul style="margin: 2px 0 0 15px; padding: 0;">
                      ${item.modifiers.map((modifier: any) => `
                        <li>${modifier.name}: ${modifier.options.map((opt: any) => opt.name).join(', ')}</li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `).join('')
          ).join('')}
          
          <div class="divider"></div>
          
          <div class="total-row">
            <div>TOTAL</div>
            <div>$${totalAmount.toFixed(2)}</div>
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
            <h1 className="text-2xl font-bold">{tablename}</h1>
          </div>
          
          {/* Bill Info */}
          <div className="text-sm mb-6 border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <p><span className="font-medium">Order #:</span> {orders.length > 0 ? orders[0].id : 'N/A'}</p>
              <p>{orders.length > 0 ? formatDate(orders[0].date) : formatDate(new Date().toISOString())}</p>
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
            
            {orders.map((order, orderIndex) => (
              order.items && order.items.map((item: OrderItem, index: number) => (
                <div key={`${orderIndex}-${index}`} className="py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex">
                      <span className="w-16 text-center">{item.quantity}x</span>
                      <span className="w-20 text-right">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Spice Level */}
                  {item.spiceLevel && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Spice Level:</span> {item.spiceLevel}
                    </div>
                  )}
                  
                  {/* Modifiers */}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Modifiers:</span>
                      <ul className="ml-2 mt-0.5">
                        {item.modifiers.map((modifier, modIndex) => (
                          <li key={modIndex}>
                            {modifier.name}: {modifier.options.map(opt => opt.name).join(', ')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ))}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>${totalAmount.toFixed(2)}</span>
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
