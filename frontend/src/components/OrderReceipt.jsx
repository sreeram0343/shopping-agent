import React from 'react';
import { CheckCircle2, Truck, Sparkles } from 'lucide-react';

export default function OrderReceipt({ receipt }) {
  const { orderId, productName, price } = receipt;
  
  // Format current date + 3-5 days for estimated delivery
  const getDeliveryRange = () => {
    const options = { month: 'short', day: 'numeric' };
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    
    return `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-emerald-100 bg-[#FFFFFF] p-6 shadow-md shadow-emerald-500/5 animate-slide-up">
      {/* Decorative background subtle glow */}
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl" />
      <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />
      
      {/* Header Info */}
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-emerald-50 px-2 py-2 text-emerald-600 border border-emerald-100">
          <CheckCircle2 className="h-8 w-8 animate-pulse-subtle" />
        </div>
        <div>
          <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
            Order Confirmed
          </span>
          <h3 className="mt-1 text-lg font-bold text-[#1E1F30]">
            Order #{orderId}
          </h3>
          <p className="text-xs text-[#8A8A99]">
            Thank you for shopping with us!
          </p>
        </div>
      </div>
      
      {/* Receipt Details Box */}
      <div className="mt-5 rounded-2xl bg-[#F7F6FB] border border-[#EFEFF2] p-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#8A8A99] font-medium">Item Ordered</span>
          <span className="text-[#1E1F30] font-semibold text-right max-w-[60%] truncate">
            {productName}
          </span>
        </div>
        <div className="mt-3 flex justify-between items-center text-sm pt-3 border-t border-[#EFEFF2]">
          <span className="text-[#8A8A99] font-medium">Total Paid</span>
          <span className="text-lg font-extrabold text-[#6D5FD8]">
            {price > 1000 ? `₹${price.toLocaleString()}` : `$${price.toFixed(2)}`}
          </span>
        </div>
      </div>
      
      {/* Shipping Timeline Banner */}
      <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 p-4 text-xs">
        <div className="text-[#6D5FD8]">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-[#1E1F30] flex items-center gap-1">
            Standard Delivery (3-5 Business Days)
            <Sparkles className="h-3 w-3 text-[#6D5FD8] animate-pulse" />
          </p>
          <p className="mt-0.5 text-[#8A8A99]">
            Est. Arrival: <span className="font-semibold text-[#6D5FD8]">{getDeliveryRange()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
