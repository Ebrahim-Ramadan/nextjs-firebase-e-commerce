'use client';

import { useDeferredValue, useState } from 'react';
import PaymentButton from './PaymentButton';

const paymentOptions = [
  {
    logo: '/assets/visa.svg',
    id: parseInt(process.env.NEXT_PUBLIC_VISA_INTEGRATION_ID, 10),
    name: 'Credit Card',
  },
  {
    logo: '/assets/mobile.svg',
    id: parseInt(process.env.NEXT_PUBLIC_MOBILE_WALLET_INTEGRATION_ID, 10),
    name: 'Mobile Wallet',
  },
  {
    logo: '/assets/pay-on-delivery.png',
    id: 'pay-on-delivery',
    name: 'Pay on Delivery',
  },
];

export const PayOptionsComponent = ({ formData }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const deferredOption = useDeferredValue(selectedOption);

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="w-full md:w-[400px] p-4 rounded-lg shadow flex flex-col items-center justify-center gap-2">
      <div className='flex font-bold items-center self-start gap-4 flex-row'>
        <p className='w-6 h-6 p-2 flex flex-row items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-white text-xs md:text-sm'>
          2
        </p>
        <label className='text-xl'>Choose Payment method</label>
      </div>

      <p className="text-xs self-start text-wrap text-slate-400 pb-1 capitalize px-8">secured and provided by <a target='_blank' className='text-blue-500' href='https://paymob.com/'>Paymob</a></p>
      <form className="space-y-4 rounded-lg shadow-md w-full md:w-[400px] py-4">
        {paymentOptions.map(({ id, logo, name }) => (
          <label
            key={id}
            className={`inline-flex justify-between w-full items-center rounded-lg p-2 border border-transparent transition-all cursor-pointer relative ${
              selectedOption === id 
                ? 'bg-blue-600 bg-opacity-50' 
                : selectedOption !== null 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/10'
            }`}
          >
            <div className="inline-flex items-center justify-center gap-4 relative z-10">
              <img src={logo} alt={name} className="w-8 h-fit" width={32} height={32} />
              <p className="font-medium text-sm">{name}</p>
            </div>
            <input
              className="checked:text-indigo-500 checked:ring-0 checked:ring-current focus:ring-0 focus:ring-current"
              value={id}
              name="payment"
              type="radio"
              checked={selectedOption === id}
              onChange={() => handleCheckboxChange(id)}
              disabled={selectedOption !== null && selectedOption !== id}
            />
          </label>
        ))}
      </form>
      <PaymentButton formData={formData} selectedOption={deferredOption} />
    </div>
  );
};

export default PayOptionsComponent;