'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface BannerSlide {
  _id?: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  order: number;
  isActive: boolean;
}

interface BannerSliderProps {
  banners: BannerSlide[];
  autoplayInterval?: number; // in milliseconds, default 4000 (4 seconds)
}

export default function BannerSlider({ banners, autoplayInterval = 4000 }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic
  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoplayInterval]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] bg-gray-900 overflow-hidden group">
      {/* Banner Image with fade transition */}
      <Image
        key={currentBanner._id}
        src={currentBanner.imageUrl}
        alt={currentBanner.title}
        fill
        className="w-full h-full object-cover transition-opacity duration-500"
        priority
        sizes="100vw"
      />

      {/* Dark overlay - lighter for elegant look */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Gradient overlay behind text - glassmorphism effect */}
      <div className="absolute inset-0 flex flex-col justify-center items-start">
        <div className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
      </div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-end items-center px-6 sm:px-10 md:px-16 pb-12 sm:pb-16 md:pb-20 z-10">
        <div className="max-w-xl text-center">
          {/* Title - Large, bold, prominent */}
          {currentBanner.title && (
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
              {currentBanner.title}
            </h2>
          )}

          {/* Subtitle - Lighter, smaller */}
          {currentBanner.subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 font-normal drop-shadow-lg max-w-lg">
              {currentBanner.subtitle}
            </p>
          )}

          {/* CTA Button - White with black text */}
          {currentBanner.link ? (
            <Link
              href={currentBanner.link}
              className="inline-flex px-8 sm:px-10 py-4 sm:py-5 bg-white text-black font-bold rounded-full transition-all duration-300 cursor-pointer text-sm sm:text-base hover:shadow-2xl hover:shadow-white/50 hover:bg-white/90 hover:scale-105 active:scale-95"
            >
              Mua ngay
            </Link>
          ) : (
            <button className="inline-flex px-8 sm:px-10 py-4 sm:py-5 bg-white text-black font-bold rounded-full transition-all duration-300 cursor-pointer text-sm sm:text-base hover:shadow-2xl hover:shadow-white/50 hover:bg-white/90 hover:scale-105 active:scale-95">
              Mua ngay
            </button>
          )}
        </div>
      </div>

      {/* Previous Button - Desktop prominent, mobile subtle */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-6 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:scale-110 active:scale-95 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Next Button - Desktop prominent, mobile subtle */}
      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:scale-110 active:scale-95 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Dot Indicators - Modern style */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 cursor-pointer h-2 sm:h-2.5 ${
              index === currentIndex
                ? 'bg-white w-8 sm:w-10 shadow-lg'
                : 'bg-white/40 w-2 sm:w-2.5 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
