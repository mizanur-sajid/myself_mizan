'use client';
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailyData = [
  { name: 'Mon', visitors: 120 }, { name: 'Tue', visitors: 150 }, { name: 'Wed', visitors: 180 },
  { name: 'Thu', visitors: 140 }, { name: 'Fri', visitors: 210 }, { name: 'Sat', visitors: 250 }, { name: 'Sun', visitors: 310 },
];

const deviceData = [
  { name: 'Desktop', value: 60 }, { name: 'Mobile', value: 30 }, { name: 'Tablet', value: 10 },
];

const sourceData = [
  { name: 'Direct', value: 400 }, { name: 'Organic', value: 300 }, { name: 'Social', value: 200 }, { name: 'Referral', value: 100 },
];

const COLORS = ['#00f0ff', '#7000ff', '#f43f5e', '#10b981'];

export const AdminCharts = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
      <GlassCard>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Daily Visitors</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="visitors" stroke="var(--primary-color)" strokeWidth={3} dot={{ fill: 'var(--primary-color)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Weekly Traffic Growth</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="visitors" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorVis)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Device Distribution</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Traffic Sources</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="value" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
