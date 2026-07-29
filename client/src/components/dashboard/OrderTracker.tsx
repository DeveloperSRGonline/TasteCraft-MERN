import React from 'react';
import type { CreatorOrder } from '../../types/dashboard';
import { Clock, CheckCircle2, Truck, AlertCircle, ChefHat } from 'lucide-react';

interface OrderTrackerProps {
  orders: CreatorOrder[];
  onStatusChange: (orderId: string, newStatus: CreatorOrder['orderStatus']) => void;
  isLoading?: boolean;
}

const statusBadgeStyles: Record<CreatorOrder['orderStatus'], { bg: string; text: string; icon: any }> = {
  Pending: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', icon: Clock },
  Preparing: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', icon: ChefHat },
  'Out for Delivery': { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400', icon: Truck },
  Delivered: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle2 },
  Cancelled: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', icon: AlertCircle },
};

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orders, onStatusChange, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 text-center text-[var(--text-body)] animate-pulse">
        Loading live order stream...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 text-center">
        <ChefHat className="w-12 h-12 text-[var(--text-body)]/40 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-[var(--text-heading)]">No Active Orders Yet</h4>
        <p className="text-xs text-[var(--text-body)] mt-1">Orders placed by gourmet food fans will show up here instantly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const StatusIcon = statusBadgeStyles[order.orderStatus].icon;

        return (
          <div
            key={order._id}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 shadow-md transition-all hover:border-[var(--border-muted)] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-[var(--text-body)]">#{order._id.slice(-6)}</span>
                <span className="text-xs text-[var(--text-body)]">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                    statusBadgeStyles[order.orderStatus].bg
                  } ${statusBadgeStyles[order.orderStatus].text}`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{order.orderStatus}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[var(--text-heading)]">
                  Customer: {order.customer?.username || 'Guest Order'}
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {order.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-black/40 px-2.5 py-1 rounded-md text-gray-300 border border-white/5"
                    >
                      {item.quantity}x {item.recipeId?.title || 'Dish'} ({item.portionSize})
                      {item.customAddons.length > 0 && ` + ${item.customAddons.join(', ')}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
              <div className="text-right">
                <div className="text-xs text-[var(--text-body)]">Total Amount</div>
                <div className="text-base font-extrabold text-[var(--accent-secondary)]">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>

              <select
                value={order.orderStatus}
                onChange={(e) => onStatusChange(order._id, e.target.value as CreatorOrder['orderStatus'])}
                className="bg-black/60 border border-[var(--border-muted)] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[var(--accent-primary)] transition-colors cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};
