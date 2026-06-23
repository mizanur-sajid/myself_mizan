'use client';

import { useEffect, useState } from 'react';
import { Clock3, CalendarDays } from 'lucide-react';

function formatBangladeshDateTime(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return formatter.format(date).replace(',', '');
}

export function AdminClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.9rem', borderRadius: '999px', border: '1px solid var(--glass-border)', background: 'var(--panel-bg)', color: 'var(--text-primary)', boxShadow: '0 12px 30px -18px rgba(0,0,0,0.35)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>
        <Clock3 size={16} />
        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>BST</span>
      </div>
      <div style={{ width: '1px', height: '1.25rem', background: 'var(--glass-border)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <CalendarDays size={16} />
        <span>{formatBangladeshDateTime(now)} Bangladesh Standard Time</span>
      </div>
    </div>
  );
}