'use client';
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, TrendingUp, Smartphone, Link2 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('daily');

  const tabs = [
    { id: 'daily', label: 'Daily Visitors', icon: <Eye size={18} /> },
    { id: 'weekly', label: 'Weekly Growth', icon: <TrendingUp size={18} /> },
    { id: 'device', label: 'Device Distribution', icon: <Smartphone size={18} /> },
    { id: 'source', label: 'Traffic Sources', icon: <Link2 size={18} /> },
  ];

  const renderChart = () => {
    switch (activeTab) {
      case 'daily':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="visitors" stroke="var(--primary-color)" strokeWidth={3} dot={{ fill: 'var(--primary-color)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="visitors" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorVis)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'device':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'source':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} cursor={{ fill: 'var(--panel-bg-hover)' }} />
              <Bar dataKey="value" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <GlassCard style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Analytics Overview</h3>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--panel-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', borderRadius: '8px', fontWeight: 500, fontSize: '0.9rem',
                background: activeTab === tab.id ? 'var(--primary-alpha-10)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid var(--primary-alpha-20)' : '1px solid transparent',
                transition: 'all 0.2s ease', cursor: 'pointer'
              }}
              className="hover:bg-white/5"
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: '400px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            {renderChart()}
          </motion.div>
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
