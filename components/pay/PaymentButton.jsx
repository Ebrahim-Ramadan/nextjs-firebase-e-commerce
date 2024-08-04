'use client';

import { useState, useEffect, memo } from 'react';
import { toast } from 'react-hot-toast';
import { getCart } from '../cart/actions';
import LoadingDots from '../loading-dots';
import { addOrder } from '@/lib/orders';
import { ShippingCost } from './ShippingCost';

export function PaymentButton({ formData, selectedOption }) {
  console.log('PaymentButton formData', formData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [structuredURL, setStructuredURL] = useState('');
  const [finalPriceState, setFinalPriceState] = useState(0);

  useEffect(() => {
    const calculateFinalPrice = () => {
      const cart = getCart();
      const prices = cart.map(item => Number(item.price) * item.quantity);
      const finalPrice = prices.reduce((total, itemPrice) => total + itemPrice, 0);
      setFinalPriceState(parseInt(finalPrice, 10));
    };

    calculateFinalPrice();
  }, []);

  const handlePayment = async () => {
    setError(false);
    const cart = getCart();

    console.log('cart', cart);

    if (!selectedOption || cart.length === 0) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const orderID = await addOrder(cart);
      console.log('order', orderID);

      if (!orderID) {
        toast.error('Error adding order, refresh');
        setError(true);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getPaymentLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPriceState * 100,
          currency: 'EGP',
          payment_methods: [selectedOption],
          items: [
            {
              name: 'rivo purchase',
              amount: finalPriceState * 100,
              quantity: 1,
            },
          ],
          billing_data: {
            first_name: formData.fullname,
            last_name: formData.fullname,
            phone_number: formData.phoneNumber,
            country: 'EG',
            email: formData.email,
            street: formData.address,
            city: formData.city,
            extra_description: formData.specialMessage,
            building: orderID,
          },
          shipping_data: {
            first_name: formData.fullname,
            last_name: formData.fullname,
            phone_number: formData.phoneNumber,
            country: 'EG',
            email: formData.email,
            street: formData.address,
            city: formData.city,
            extra_description: formData.specialMessage,
            building: orderID,
          },
          customer: {
            fulllname: formData.fullname,
            last_name: formData.fullname,
            phone_number: formData.phoneNumber,
            country: 'EG',
            email: formData.email,
            street: formData.address,
            city: formData.city,
            building: orderID,
          },
        }),
        cache: 'no-store',
      });

      const res = await response.json();
      console.log('res', res);
      if (!res.error) {
        const { client_secret } = res;
        setStructuredURL(`https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`);
      } else {
        toast.error(res.error);
        setError(true);
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col w-full items-center justify-center'>
      {selectedOption && (
        !error ? (
          loading ? (
            <LoadingDots />
          ) : (
            structuredURL ? (
              <a href={structuredURL} rel="noopener noreferrer" className='my-2 text-center rounded-full text-black py-1 font-bold w-full bg-white'>
                <button className='w-full py-2 text-lg'>
                  Proceed to Payment
                </button>
              </a>
            ) : (
              <button
                onClick={handlePayment}
                className='my-2 text-center rounded-full text-black py-1 font-bold w-full bg-white'
                disabled={selectedOption === null}
              >
                Pay Now EGP {finalPriceState.toFixed(2)}
              </button>
            )
          )
        ) : (
          <p className='text-center text-red-500 text-sm py-4'>Empty Cart or Payment Failed, refresh and try again</p>
        )
      )}
      <div className="bg-gray-900 text-gray-300 py-8 p-4 rounded-lg max-w-md">
        <p className="text-sm mb-4">
          By placing your order, you agree to RIVO&apos;s
          <a href="/privacyandpolicy" className="text-blue-500 hover:underline"> privacy note</a> and 
          <a href="/privacyandpolicy" className="text-blue-500 hover:underline"> terms of use</a>.
        </p>
        
        <h2 className="text-white text-lg font-semibold mb-2">Your benefits:</h2>
        
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Pre-order guarantee</li>
          <li>Fast shipping</li>
          <li>Best price</li>
        </ul>
        
        <ShippingCost trigger='How are Shipping Costs Calculated?' className='text-sm self-center'/>
      </div>
    </div>
  );
}

export default memo(PaymentButton);