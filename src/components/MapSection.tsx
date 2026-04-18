'use client';

interface MapSectionProps {
  location?: string;
  coordinates?: string;
  height?: string;
  className?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ 
  location = "Hill Side Homes, Khajri Ring Road, Near New RTO Office, Manegaon, Dungariya, Chhindwara, MP 480001",
  coordinates = "21.9281,78.7858",
  height = "h-[450px]",
  className = ""
}) => {
  const mapEmbedUrl = "https://www.google.com/maps?q=Hill+Side+Homes+Khajri+Ring+Road+Near+New+RTO+Office+Manegaon+Dungariya+Chhindwara+MP+480001&output=embed";

  const mapsUrl = "https://maps.app.goo.gl/a4CxZ8s577tziXgVA";

  return (
    <section className={`w-full ${className}`}>
      {/* Location Heading */}
      <div className="mb-4 sm:mb-6 text-center px-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">{location}</h2>
      </div>
      
      {/* Map Container */}
      <div className={`relative ${height} rounded-2xl overflow-hidden shadow-lg mx-4 sm:mx-0`}>
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
        
        {/* Map Controls - Positioned at bottom right inside iframe */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10">
          {/* Open in Google Maps Button */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
              <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H5z"/>
            </svg>
            <span className="text-xs">Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
