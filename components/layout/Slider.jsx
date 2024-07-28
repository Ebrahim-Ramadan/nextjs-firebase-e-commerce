'use client';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useRef } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  return (
   <div className="mb-4 w-full md:px-40 ">
     <div
      className="relative md:h-[40rem] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full md:h-[40rem] h-full relative flex justify-center items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.bg})` }}
          >
            <Image
              alt="slide"
              width={500}
              height={500}
              className="rounded-lg inset-0 h-full w-full object-cover"
              src={slide.bg}
            />
            <div className="absolute inset-0 flex flex-col h-full justify-between py-2 items-center">
              <div className="text-white text-base backdrop-blur-3xl bg-white/10 md:text-3xl font-bold mt-2  p-2 md:p-4 rounded-full">
                {slide.text}
              </div>
              <button className="bg-black/80 backdrop-blur-3xl text-white text-sm md:text-xl font-bold rounded-full p-2 md:p-4  ">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="absolute top-1/2 transform -translate-y-1/2 left-4 backdrop-blur-3xl bg-black/60 text-white p-2 rounded-full transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white"
        onClick={goToPrevious}
      >
        <ArrowLeft/>
      </button>
      <button
        className="absolute top-1/2 transform -translate-y-1/2 right-4 backdrop-blur-3xl bg-black/60 text-white p-2 rounded-full transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white"
        onClick={goToNext}
      >
              <ArrowRight/>

      </button>
    </div>
   </div>
  );
};