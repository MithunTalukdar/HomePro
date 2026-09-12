import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, AlertTriangle, ArrowRight } from 'lucide-react';
import { fetchApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, action?: any }[]>([
    { role: 'assistant', content: 'Hi! I am your AI Service Assistant. Describe your electrical problem, and I will find the right service for you!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {



      const token = localStorage.getItem('token');
      if (!token) {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Please log in to use the AI Assistant.' }]);
          setIsLoading(false);
        }, 500);
        return;
      }

      const res = await fetchApi('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage })
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: res.suggestedResponse,
        action: res
      }]);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the network right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (category: string) => {
    setIsOpen(false);

    navigate('/services');
  };

  return (
    <>
      
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--primary)', color: 'white',
          display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)', cursor: 'pointer', border: 'none'
        }}
      >
        <Bot size={32} />
      </button>

      
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50,
          width: '350px', height: '500px', background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)'
        }}>
          
          <div style={{ padding: '1rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Bot size={20} /> AI Assistant
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}>
              <X size={20} />
            </button>
          </div>

          
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                {msg.action?.isHazardous && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <AlertTriangle size={14} /> SAFETY WARNING
                  </div>
                )}
                <div style={{
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--surface)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                  padding: '0.75rem 1rem', borderRadius: '1rem',
                  borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                  borderBottomLeftRadius: msg.role === 'user' ? '1rem' : '0',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  fontSize: '0.875rem', lineHeight: 1.5
                }}>
                  {msg.content}
                </div>
                
                {msg.action?.recommendedCategory && (
                  <button 
                    onClick={() => handleAction(msg.action.recommendedCategory)}
                    style={{
                      marginTop: '0.5rem', background: 'var(--background)', border: '1px solid var(--primary)', 
                      color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                  >
                    Find {msg.action.recommendedCategory} <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid var(--border)', fontSize: '0.875rem' }}>
                <span className="dot-pulse">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="search-input"
                style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-full)' }}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                style={{ 
                  background: 'var(--primary)', color: 'white', border: 'none', 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (isLoading || !input.trim()) ? 0.7 : 1
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
