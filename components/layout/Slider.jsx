'use client';
import eventEmitter from '@/lib/eventEmitter';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useDeferredValue } from 'react';
import LoadingDots from '../loading-dots';

const slides = [
  {
    id: 1,
    bg: '/landing-carousel/1.webp',
    text: 'Our New Collection is Here',
  },
  {
    id: 2,
    bg: '/landing-carousel/2.webp',
    text: 'Get Your Frames Done',
  },
  {
    id: 3,
    bg: '/landing-carousel/3.webp',
    text: 'Customized Posters',
  },
];

export const Slider = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState(
    slides.reduce((acc, slide) => {
      acc[slide.id] = true;
      return acc;
    }, {})
  );
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Use useDeferredValue for currentIndex
  const deferredIndex = useDeferredValue(currentIndex);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      goToNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      goToPrevious();
    }
  };

  const handleImageLoad = (id) => {
    setLoadingStates((prevState) => ({
      ...prevState,
      [id]: false,
    }));
  };

  return (
     <div className="mb-4 w-full">
      <div
        className="relative md:h-[40rem] w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${deferredIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full md:h-[40rem] h-full relative flex justify-center items-center bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.bg})` }}
            >
              {loadingStates[slide.id] && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                  <LoadingDots/>
                </div>
              )}
              <Image
                alt="slide"
                width={1000}
                height={1000}
                className="rounded-lg inset-0 h-full w-full object-cover"
                src={slide.bg}
                onLoadingComplete={() => handleImageLoad(slide.id)}
                onError={() => handleImageLoad(slide.id)}
              />
              <div className="absolute text-white inset-0 flex flex-col h-full justify-start py-2 items-center">
                <div 
                onClick={()=>{
                  if (slide.text === 'Customized Posters') {
                    router.push('https://www.instagram.com/rivoo_gallery?igsh=MThjOXNrY2pnemx3bw==');
                    return
                  }
                  else if (slide.text === 'Our New Collection is Here') {
                    eventEmitter.emit('openLeftModal'); // Emit event to open left dialog
                    return
                  }
       

                }}
                className="font-bold  md:text-2xl px-4 py-2 bg-black/40 transition duration-200 backdrop-blur-[8px] rounded-full">
                  {slide.text}
                </div>
                {/* <button className="font-bold text-xl px-4 py-2 bg-black/50 hover:bg-black/80 transition duration-200 backdrop-blur-[2px] rounded-full">
                  Shop Now
                </button> */}
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute top-1/2 transform -translate-y-1/2 left-2 md:left-4 backdrop-blur-3xl bg-black/60 text-white p-2 rounded-full transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white"
          onClick={goToPrevious}
        >
          <ArrowLeft size='20'/>
        </button>
        <button
          className="absolute top-1/2 transform -translate-y-1/2 right-2 md:right-4 backdrop-blur-3xl bg-black/60 text-white p-2 rounded-full transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white"
          onClick={goToNext}
        >
          <ArrowRight size='20'/>
        </button>
      </div>
    </div>
  );
};
