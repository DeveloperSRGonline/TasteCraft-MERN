import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, getSubtotal, getDeliveryFee, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Gourmet Order Cart">
      <div className="flex flex-col h-[calc(100vh-100px)] justify-between">
        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="text-sm text-zinc-400">Your cart is currently empty</p>
              <p className="text-xs text-zinc-500">Explore community recipes to order delicious dishes!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex gap-3 items-center hover:border-zinc-700 transition-all"
              >
                <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                  <p className="text-xs text-[--accent-secondary] font-medium">{item.portionSize.label}</p>
                  {item.selectedAddons.length > 0 && (
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      + {item.selectedAddons.map((a) => a.name).join(', ')}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-white mt-1">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center space-x-1.5 bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold text-white px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-[--border-muted]/40 space-y-3 bg-[--bg-surface]">
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-white font-mono">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                <span>Total</span>
                <span className="text-[--accent-primary] font-mono text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-3 text-sm font-bold shadow-lg shadow-[--accent-primary]/30 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Razorpay Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Encrypted SSL 256-bit Secure Payment</span>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

