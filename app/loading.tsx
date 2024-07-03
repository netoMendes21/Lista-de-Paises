import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Loading() {
  const arr = Array.from({length: 20});
  return (
    <section className="grid grid-cols-5 container mt-12 gap-3">
    {arr.map((_, index) => (
      
      <article key={index} className="h-64 min-w-full p-2 transition-shadow bg-white border-2 border-transparent animate-pulse group row-auto">
  
        <div className="flex items-center justify-center w-full h-40 p-2 mb-4 overflow-hidden bg-gray-300 rounded-xl">
            
            <svg className="w-12 h-12 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80ZM560 128C570.8 128 576 118.8 576 112C576 105.2 570.8 96 560 96C549.2 96 544 105.2 544 112C544 118.8 549.2 128 560 128Z"/>
            </svg>
        </div>
        <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
  
        <span className="sr-only">Loading...</span>
      </article>
    ))}
  </section>
  )
}