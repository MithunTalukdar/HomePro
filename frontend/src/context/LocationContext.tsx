import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CityOption {
  name: string;
  state: string;
  pincode: string;
  popularAreas: string[];
}

export const POPULAR_CITIES: CityOption[] = [
  {
    name: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    popularAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Electronic City']
  },
  {
    name: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    popularAreas: ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Gariahat', 'Behala', 'Dum Dum']
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    popularAreas: ['Bandra', 'Andheri West', 'Powai', 'Juhu', 'Worli', 'Colaba', 'Thane']
  },
  {
    name: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110001',
    popularAreas: ['Connaught Place', 'South Extension', 'Dwarka', 'Gurgaon Cyber City', 'Noida Sector 18']
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    popularAreas: ['Hitec City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Kondapur']
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    popularAreas: ['T. Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'OMR', 'Besant Nagar']
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    popularAreas: ['Koregaon Park', 'Viman Nagar', 'Baner', 'Wakad', 'Kothrud', 'Hinjewadi']
  },
  {
    name: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    popularAreas: ['Satellite', 'SG Highway', 'Bodakdev', 'Vastrapur', 'Navrangpura', 'Prahlad Nagar']
  }
];

interface LocationContextType {
  city: string;
  area: string;
  pincode: string;
  fullLocationString: string;
  isDetecting: boolean;
  isModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  selectLocation: (city: string, area?: string, pincode?: string) => void;
  detectCurrentLocation: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [city, setCity] = useState<string>(() => {
    return localStorage.getItem('user_city') || 'Bangalore';
  });
  const [area, setArea] = useState<string>(() => {
    return localStorage.getItem('user_area') || 'Indiranagar';
  });
  const [pincode, setPincode] = useState<string>(() => {
    return localStorage.getItem('user_pincode') || '560038';
  });
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('user_city', city);
    localStorage.setItem('user_area', area);
    localStorage.setItem('user_pincode', pincode);
  }, [city, area, pincode]);

  const selectLocation = (newCity: string, newArea?: string, newPincode?: string) => {
    const matchedCity = POPULAR_CITIES.find(c => c.name.toLowerCase() === newCity.toLowerCase());
    setCity(newCity);
    const resolvedArea = newArea || (matchedCity ? matchedCity.popularAreas[0] : 'Main City');
    const resolvedPincode = newPincode || (matchedCity ? matchedCity.pincode : '560001');
    setArea(resolvedArea);
    setPincode(resolvedPincode);
    setIsModalOpen(false);
  };

  const detectCurrentLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return false;
    }

    setIsDetecting(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Using reverse geocode from OpenStreetMap Nominatim for accurate area/city
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const detectedCity = addr.city || addr.town || addr.state_district || addr.state || 'Bangalore';
              const detectedArea = addr.suburb || addr.neighbourhood || addr.residential || addr.road || 'Current Locality';
              const detectedPin = addr.postcode || '560001';

              selectLocation(detectedCity, detectedArea, detectedPin);
              setIsDetecting(false);
              resolve(true);
              return;
            }
          } catch (e) {
            // fallback
          }

          // Fallback if reverse geocoding is slow or blocked
          selectLocation('Bangalore', 'GPS Detected Locality', '560001');
          setIsDetecting(false);
          resolve(true);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          setIsDetecting(false);
          alert('Unable to detect current GPS location. Please choose your city from the list.');
          resolve(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  const fullLocationString = `${area}, ${city}`;

  return (
    <LocationContext.Provider
      value={{
        city,
        area,
        pincode,
        fullLocationString,
        isDetecting,
        isModalOpen,
        openLocationModal: () => setIsModalOpen(true),
        closeLocationModal: () => setIsModalOpen(false),
        selectLocation,
        detectCurrentLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
