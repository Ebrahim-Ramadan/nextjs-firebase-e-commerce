'use client';

import { useState, useEffect, memo } from 'react';
import { toast } from 'react-hot-toast';
import { getCart } from '../cart/actions';
import LoadingDots from '../loading-dots';
import { addOrder } from '@/lib/orders';
import { ShippingCost } from './ShippingCost';

export  function PaymentButton({ formData,selectedOption }) {
console.log('PaymentButton formData', formData);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [strcutred_URL, setstrcutred_URL] = useState('');
  const [finalPriceState, setfinalPriceState] = useState(0);

  useEffect(() => {
    const handlePayment = async () => {
      seterror(false);
      const cart = getCart();

      console.log('cart', cart);
      

      const prices = cart.map(item => {
        return Number(item.price) * item.quantity;
      });
      
      // Calculate the final price by summing up all the item totals
      const finalPrice = prices.reduce((total, itemPrice) => total + itemPrice, 0)*100;
      setfinalPriceState(parseInt(prices.reduce((total, itemPrice) => total + itemPrice, 0), 10))
      if (!selectedOption || cart.length===0) {
        seterror(true);
        return
      }; // Avoid making a request if no option is selected pr empty cart
     
      
      setLoading(true);
      try {
        const orderID = await addOrder(cart);
      console.log('order', orderID);

      if(!orderID) {
        toast.error('Error adding order, referesh');
        seterror(true);
        return
      }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getPaymentLink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseInt(finalPrice, 10),
            currency: 'EGP',
            payment_methods: [selectedOption],
            items: [
              {
                name: 'rivo purchase',
                amount: parseInt(finalPrice, 10),
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
              building:orderID,

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
              building:orderID,
              
            },
            // formData,
            customer: {
              fulllname: formData.fullname,
              last_name: formData.fullname,
              phone_number: formData.phoneNumber,
              country: 'EG',
              email: formData.email,
              street: formData.address,
              city: formData.city,
              building:orderID,
              
            },
           
          }),
          cache: 'no-store',
        });

        const res = await response.json();
        console.log('res', res);
        if (!res.error){
          
          const { client_secret } = res;
          setstrcutred_URL(`https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`)
        }
        else{
          toast.error(res.error);
          seterror(true);
        }
       
      } catch (error) {
        console.error('Error creating payment link:', error);
      } finally {
        setLoading(false);
      }
    };

    handlePayment();
  }, [selectedOption]); // Dependency array with selectedOption

  


  return (
    <div className=' flex flex-col w-full items-center justify-center'>

      {selectedOption&&
      (error?  
        <p className='text-center text-red-500 text-sm'>Empty Cart or Payment Failed, referesh and try again</p>
      :
  (
    loading ? (
      <LoadingDots/>
    ) : (
      <a  href={strcutred_URL} rel="noopener noreferrer" className='text-center rounded-full text-black py-1 font-bold w-full bg-white'>
      <button className='w-full' disabled={selectedOption === null}>
  Pay Now EGP {finalPriceState.toFixed(2)}
      </button>
      </a>
    )
  ))
      }
     <div class="bg-gray-900 text-gray-300 py-8 p-4 rounded-lg max-w-md">
  <p class="text-sm mb-4">
    By placing your order, you agree to RIVO&apos;
    <a href="/privacyandpolicy" class="text-blue-500 hover:underline"> privacy note</a> and 
    <a href="/privacyandpolicy" class="text-blue-500 hover:underline"> terms of use</a>.
  </p>
  
  <h2 class="text-white text-lg font-semibold mb-2">Your benefits:</h2>
  
  <ul class="list-disc list-inside mb-4 space-y-1">
    <li>Pre-order guarantee</li>
    <li>Fast shipping</li>
    <li>Best price</li>
  </ul>
  
  <ShippingCost trigger='How are Shipping Costs Calculated?' className='text-sm  '/>
  
</div>
      </div>
  );
}

export default memo(PaymentButton);