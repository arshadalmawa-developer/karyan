'use client';

interface MapSectionProps {
  location?: string;
  coordinates?: string;
  height?: string;
  className?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ 
  location = "Chandan Nagar, Pune, Maharashtra",
  coordinates = "18.6298,73.7997",
  height = "h-96",
  className = ""
}) => {
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.123456789!2d73.7997!3d18.6298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMThDLjYyOTksIDczLjc5OTcgKQ!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Map Container */}
        <div className={`relative ${height}`}>
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full rounded-t-2xl"
          />
          
          {/* Location Badge */}
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm font-medium text-gray-800">{location}</span>
            </div>
          </div>
        </div>
        
        {/* Map Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-gray-600">
                {location}
              </span>
            </div>
            
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H5z"/>
              </svg>
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
