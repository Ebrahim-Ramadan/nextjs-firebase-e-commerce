'use client';
import { copyToClipboard } from '@/lib/utils';
import { ArrowLeft, Share } from 'lucide-react'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';


export const ProductNav = ({category}) => {
  console.log('category', category);
  const [CurrentURL, setCurrentURL] = useState('')
  useEffect(() => {
    const currentUrl = window.location.href;
    setCurrentURL(currentUrl)
  }, []);
  return (
    <div className='w-full flex flex-row justify-between py-4 items-center [&>*]:transition [&>*]:duration-200 '>
            <Link href='/' className='rounded-full p-2 bg-blue-600 text-white  hover:bg-blue-700'>
            <ArrowLeft size='16'/>

            </Link>

            {category == 'Frame sets' && 
            <div className='text-xs font-medium bg-opacity-60 flex items-center text-[#DB2777] bg-[#4f0724] px-2 py-1 rounded-xl'>
              <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
              <path stroke="currentColor" d="M6.833 2C6.368 4.356 6.365 4.356 4 4.833M6.833 2c.47 2.363.473 2.366 2.834 2.833M6.833 2v5.667m2.834-2.834c-2.36.468-2.36.472-2.834 2.834m2.834-2.834H4m2.833 2.834C6.365 5.3 6.358 5.3 4 4.833m0 4.834c-.328 1.663-.33 1.663-2 2m2-2c.332 1.668.334 1.67 2 2m-2-2v4m2-2c-1.666.33-1.666.332-2 2m2-2H2m2 2c-.33-1.67-.336-1.67-2-2m9.667-4.334c-.383 1.94-.386 1.94-2.334 2.334m2.334-2.334c.386 1.946.39 1.949 2.333 2.334m-2.333-2.334V12M14 9.667c-1.944.385-1.944.388-2.333 2.333M14 9.667H9.333M11.667 12c-.386-1.948-.392-1.948-2.334-2.333" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span>Discount</span>
              </div>
            }
            <button href='/' className='hover:bg-blue-700 rounded-full p-2 bg-blue-600 text-white' onClick={()=>{
              copyToClipboard(CurrentURL)
              toast.success('Link Copied to clipboard')
            }}>
            <Share size='16'/>

            </button>
          </div>
  )
}
