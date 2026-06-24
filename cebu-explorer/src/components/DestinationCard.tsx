import React, { useState } from 'react';
import { Destination } from '../data/destinations';
import { Star, MapPin, ChevronDown } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onBook: (destinationId: string) => void;
  isHighlighted?: boolean;
  key?: string;
}

export default function DestinationCard({ destination, onBook, isHighlighted }: DestinationCardProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <article 
      id={`dest-${destination.id}`}
      className={`bg-white rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(6,59,84,0.08)] transition-all duration-300 flex flex-col relative border border-[rgba(6,59,84,0.05)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(6,59,84,0.22)] ${
        isHighlighted ? 'ring-4 ring-[#f6b042] animate-pulse z-10' : ''
      }`}
    >
      {/* Card Image and Badge */}
      <div className="relative aspect-video overflow-hidden bg-[#ead9b8]">
        <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/92 backdrop-blur-sm text-[#063b54]">
          {destination.badge}
        </span>
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#063b54]/45 to-transparent"></div>
      </div>

      {/* Card Content Body */}
      <div className="p-5.5 flex flex-col flex-1 gap-2.5">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-serif font-bold text-xl text-[#063b54] leading-tight">
            {destination.name}
          </h3>
          <div className="flex items-center gap-1 text-[#f6b042] text-sm shrink-0">
            <Star className="w-4 h-4 fill-[#f6b042]" />
            <span className="font-semibold text-[13px]">{destination.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location Links */}
        <div className="flex items-center gap-1.5 text-[#1aa3c4] text-[13px] font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <a 
            href={destination.mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#0a6b8a]"
            title="View on Google Maps"
          >
            {destination.location}
          </a>
        </div>

        <p className="text-[#5b6b76] text-[13px] leading-relaxed">
          {destination.description}
        </p>

        {/* Collapsible Read More details */}
        <div className="mt-1.5">
          <div 
            className={`overflow-hidden transition-all duration-300 bg-gradient-to-br from-[#fffaf0] to-[#f6efe1] rounded-xl px-3.5 ${
              showMore ? 'max-h-72 opacity-100 py-3 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-[12.5px] text-[#0c2230]">
              <strong className="text-[#1f6f4a] font-semibold">Why visit: </strong> 
              {destination.whyVisit}
            </p>
          </div>

          <button 
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="inline-flex items-center gap-1 text-[#0a6b8a] font-semibold text-[13px] mt-2 pt-2 hover:text-[#1aa3c4] cursor-pointer"
          >
            <span>{showMore ? 'Show less' : 'Read more'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dynamic Reservation CTA */}
        <button 
          type="button"
          onClick={() => onBook(destination.id)}
          className="mt-4 w-full bg-gradient-to-r from-[#0a6b8a] to-[#1aa3c4] text-white py-2.5 rounded-xl font-semibold text-xs text-center transition-all duration-300 hover:shadow-md hover:brightness-105 cursor-pointer"
        >
          Book Travel Reservation →
        </button>
      </div>
    </article>
  );
}
