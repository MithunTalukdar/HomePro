import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { fetchApi } from '../../services/api';
import { MapPin, Navigation, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export function BookingTracker() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const { socket, isConnected } = useSocket(token);
  
  const [booking, setBooking] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [techLocation, setTechLocation] = useState<{lat: number, lng: number} | null>(null);
  const [user, setUser] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        const profile = await fetchApi('/users/profile');
        setUser(profile);

        const bData = await fetchApi(`/bookings/${id}`);
        setBooking(bData);
        setStatus(bData.status);
        
        // Load chat history if we have an endpoint, for now we will just load empty or mock
        // const chatHistory = await fetchApi(`/chat/${id}`);
        // setMessages(chatHistory);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (!socket || !isConnected || !booking) return;

    socket.emit('join-booking', id);

    socket.on('booking-status-changed', (data: { status: string }) => {
      setStatus(data.status);
    });

    socket.on('new-message', (message: any) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('location-updated', (coords: { lat: number, lng: number }) => {
      setTechLocation(coords);
    });

    return () => {
      socket.off('booking-status-changed');
      socket.off('new-message');
      socket.off('location-updated');
    };
  }, [socket, isConnected, booking, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !booking) return;

    // Determine receiver (if customer, send to tech; if tech, send to customer)
    const receiverId = user?.role === 'CUSTOMER' ? booking.technicianId : booking.customerId;

    socket.emit('send-message', {
      bookingId: id,
      receiverId,
      text: newMessage
    });

    setNewMessage('');
  };

  if (!booking) return <div style={{ padding: '2rem' }}>Loading tracking...</div>;

  const getStatusStep = () => {
    const statuses = ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'];
    return statuses.indexOf(status);
  };

  const simulateLocation = () => {
    if (!socket || !isConnected) return;
    const baseLat = 28.7041;
    const baseLng = 77.1025;
    
    // Simulate moving around by adding random small offsets
    const lat = baseLat + (Math.random() - 0.5) * 0.01;
    const lng = baseLng + (Math.random() - 0.5) * 0.01;
    
    setTechLocation({ lat, lng });
    
    socket.emit('update-location', {
      bookingId: id,
      latitude: lat,
      longitude: lng
    });
  };

  const currentStep = getStatusStep();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: 'calc(100vh - 140px)' }}>
      
      {/* Main Tracking Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', paddingRight: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Booking Tracking</h1>
            <p style={{ color: 'var(--text-muted)' }}>ID: {id?.slice(-6).toUpperCase()}</p>
          </div>
          <div style={{ padding: '0.5rem 1rem', background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isConnected ? '#10b981' : '#ef4444', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600 }}>
            {isConnected ? 'Live Connection Active' : 'Disconnected'}
          </div>
        </div>

        {/* Live Status Timeline */}
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2rem' }}>Live Status</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '15px', left: 0, width: '100%', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', top: '15px', left: 0, width: ((currentStep / 6) * 100) + '%', height: '2px', background: 'var(--primary)', zIndex: 1, transition: 'width 0.5s ease' }}></div>
            
            {['Requested', 'Confirmed', 'Assigned', 'On the way', 'Arrived', 'In Progress', 'Completed'].map((stepTitle, idx) => (
              <div key={stepTitle} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: currentStep >= idx ? 'var(--primary)' : 'var(--surface)', 
                  border: '2px solid ' + (currentStep >= idx ? 'var(--primary)' : 'var(--border)'),
                  color: currentStep >= idx ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.3s ease'
                }}>
                  {currentStep > idx ? <CheckCircle2 size={16} /> : (idx + 1)}
                </div>
                <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: currentStep === idx ? 700 : 500, color: currentStep >= idx ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {stepTitle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conceptual Live Map */}
        {(status === 'ON_THE_WAY' || status === 'IN_PROGRESS') && (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', flex: 1, minHeight: '300px', position: 'relative' }}>
            {/* Map Placeholder */}
            <div style={{ width: '100%', height: '100%', background: '#e5e7eb', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', position: 'absolute', inset: 0 }}></div>
            
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 10 }}>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={16} color="var(--primary)" /> Live Tracking
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {techLocation ? 'Lat: ' + techLocation.lat.toFixed(4) + ', Lng: ' + techLocation.lng.toFixed(4) : 'Waiting for GPS signal...'}
              </div>
            </div>

            {/* Technician Marker */}
            {techLocation && (
              <div style={{ 
                position: 'absolute', 
                top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '24px', height: '24px', 
                background: 'var(--primary)', 
                borderRadius: '50%', 
                border: '3px solid white',
                boxShadow: '0 0 15px rgba(79, 70, 229, 0.5)'
              }}></div>
            )}
            
            {/* Customer Marker */}
            <div style={{ 
              position: 'absolute', 
              top: '20%', left: '70%', 
              transform: 'translate(-50%, -50%)',
              color: '#ef4444'
            }}>
              <MapPin size={32} fill="#ef4444" color="white" />
            </div>

            {user?.role === 'TECHNICIAN' && (
              <button 
                onClick={simulateLocation}
                className="btn btn-primary"
                style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 20 }}
              >
                Broadcast Test Location
              </button>
            )}
          </div>
        )}

      </div>

      {/* Chat Sidebar */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageCircle size={20} color="var(--primary)" />
          <h3 style={{ fontWeight: 600 }}>Message Professional</h3>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.senderId === user?._id;
              return (
                <div key={idx} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  <div style={{ 
                    background: isMine ? 'var(--primary)' : 'var(--background)',
                    color: isMine ? 'white' : 'var(--text-main)',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    borderBottomRightRadius: isMine ? '0' : '1rem',
                    borderBottomLeftRadius: isMine ? '1rem' : '0',
                    border: isMine ? 'none' : '1px solid var(--border)'
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: isMine ? 'right' : 'left' }}>
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="search-input"
              style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--surface)' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }} disabled={!newMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
}
