import { useCallback } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = useCallback(
    async (options: {
      items: any[];
      userEmail?: string;
      userName?: string;
      onSuccess: (order: any) => void;
      onError?: (err: any) => void;
    }) => {
      try {
        const isLoaded = await loadScript();
        if (!isLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        // 1. Create Razorpay order on backend
        const res = await fetch('/api/v1/orders/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: options.items }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create Razorpay order');
        }

        // 2. Configure Razorpay checkout popup options
        const rzpOptions = {
          key: data.keyId || 'rzp_test_dummyKey',
          amount: data.amount,
          currency: data.currency || 'INR',
          name: 'TasteCraft Gourmet',
          description: 'Recipe Dish Order Checkout',
          order_id: data.razorpayOrderId,
          prefill: {
            name: options.userName || 'Gourmet Foodie',
            email: options.userEmail || 'customer@tastecraft.com',
          },
          theme: {
            color: '#FF385C',
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // 3. Verify payment signature on backend
              const verifyRes = await fetch('/api/v1/orders/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                options.onSuccess(verifyData.order);
              } else {
                throw new Error(verifyData.error || 'Payment verification failed');
              }
            } catch (err: any) {
              if (options.onError) options.onError(err);
            }
          },
          modal: {
            ondismiss: () => {
              console.log('Razorpay payment modal closed by user');
            },
          },
        };

        const razorpayInstance = new window.Razorpay(rzpOptions);
        razorpayInstance.open();
      } catch (error: any) {
        if (options.onError) {
          options.onError(error);
        } else {
          alert(`Checkout Error: ${error.message}`);
        }
      }
    },
    []
  );

  return { processPayment };
};
