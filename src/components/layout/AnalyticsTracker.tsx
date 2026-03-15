import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Adjust based on your setup
import { v4 as uuidv4 } from 'uuid';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      // Create or get a session ID for this browser session
      let sessionId = sessionStorage.getItem('lily_session_id');
      if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem('lily_session_id', sessionId);
      }

      const userAgent = navigator.userAgent;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

      await supabase.from('traffic_logs').insert({
        page_path: location.pathname,
        referrer: document.referrer || 'Direct',
        device_type: isMobile ? 'Mobile' : 'Desktop',
        browser: navigator.appName,
        session_id: sessionId
      });
    };

    trackVisit();
  }, [location.pathname]);

  return null; 
}