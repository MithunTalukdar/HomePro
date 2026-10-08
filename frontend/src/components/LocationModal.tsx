import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Check, Search, Building2 } from 'lucide-react';
import { useLocationContext, POPULAR_CITIES } from '../context/LocationContext';

export function LocationModal() {
  const { 
    city, 
    area, 
    pincode, 
    isModalOpen, 
    closeLocationModal, 
    selectLocation, 
    detectCurrentLocation, 
    isDetecting 
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityName, setSelectedCityName] = useState(city);
  const [selectedAreaName, setSelectedAreaName] = useState(area);
  const [customPincode, setCustomPincode] = useState(pincode);

  const activeCityObj = POPULAR_CITIES.find(c => c.name.toLowerCase() === selectedCityName.toLowerCase()) || POPULAR_CITIES[0];

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.popularAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.pincode.includes(searchQuery)
  );

  const handleCityPick = (cName: string) => {
    setSelectedCityName(cName);
    const targetCity = POPULAR_CITIES.find(c => c.name === cName);
    if (targetCity) {
      setSelectedAreaName(targetCity.popularAreas[0]);
      setCustomPincode(targetCity.pincode);
    }
  };

  const handleConfirm = () => {
    selectLocation(selectedCityName, selectedAreaName, customPincode);
  };

  const handleDetect = async () => {
    const success = await detectCurrentLocation();
    if (success) {
      closeLocationModal();
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(11, 17, 32, 0.85)', backdropFilter: 'blur(8px)' }}
            onClick={closeLocationModal}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              background: 'var(--surface)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '1.5rem',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(79, 70, 229, 0.15)',
              zIndex: 10,
              padding: '2rem'
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeLocationModal}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'rgba(79, 70, 229, 0.15)',
                color: 'var(--primary-light)',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                  Choose Your Location
                </h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                  Select city and area for accurate pro availability and pricing
                </p>
              </div>
            </div>

            {/* Auto Detect Location Button */}
            <button
              type="button"
              onClick={handleDetect}
              disabled={isDetecting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(16, 185, 129, 0.15))',
                border: '1px solid rgba(79, 70, 229, 0.4)',
                borderRadius: '0.875rem',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: isDetecting ? 'wait' : 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.15)'
              }}
              onMouseOver={e => { if (!isDetecting) e.currentTarget.style.borderColor = 'var(--primary-light)'; }}
              onMouseOut={e => { if (!isDetecting) e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.4)'; }}
            >
              <Navigation size={18} className={isDetecting ? 'animate-spin' : ''} color="var(--accent-electric)" />
              {isDetecting ? 'Detecting current GPS location...' : 'Use My Current Location (GPS Auto-Detect)'}
            </button>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem'
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search city, area or pincode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.95rem'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Cities Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Major Service Cities
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.6rem' }}>
                {filteredCities.map(c => {
                  const isSelected = selectedCityName.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleCityPick(c.name)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.75rem 0.5rem',
                        borderRadius: '0.75rem',
                        background: isSelected ? 'rgba(79, 70, 229, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1.5px solid var(--primary-light)' : '1px solid rgba(255, 255, 255, 0.06)',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                      onMouseOver={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#fff'; } }}
                      onMouseOut={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
                    >
                      <Building2 size={18} style={{ marginBottom: '0.35rem', color: isSelected ? 'var(--primary-light)' : 'var(--text-muted)' }} />
                      <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: '0.85rem' }}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popular Localities in Selected City */}
            {activeCityObj && (
              <div style={{ marginBottom: '1.5rem', background: 'rgba(0, 0, 0, 0.2)', padding: '1rem', borderRadius: '0.875rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  Popular Areas in <strong style={{ color: '#fff' }}>{activeCityObj.name}</strong>:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {activeCityObj.popularAreas.map(ar => {
                    const isAreaSelected = selectedAreaName.toLowerCase() === ar.toLowerCase();
                    return (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setSelectedAreaName(ar)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: isAreaSelected ? 600 : 400,
                          background: isAreaSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                          color: isAreaSelected ? '#fff' : 'var(--text-muted)',
                          border: isAreaSelected ? '1px solid var(--primary-light)' : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s'
                        }}
                      >
                        {isAreaSelected && <Check size={12} />}
                        {ar}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm Location Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="button"
                onClick={closeLocationModal}
                className="btn btn-outline"
                style={{ flex: 1, padding: '0.75rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Check size={18} /> Set Location to {selectedAreaName}, {selectedCityName}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
