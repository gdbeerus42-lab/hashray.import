import React from 'react';
import { LayoutDashboard, Upload, FileCheck, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Drafts', icon: Upload },
    { id: 'verification', label: 'Verification Center', icon: FileCheck },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
        <h2 style={{ margin: 0, letterSpacing: '-1px' }}>METALLORA</h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Digital Verification</span>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? 'var(--accent-black)' : 'transparent',
                color: isActive ? 'var(--accent-white)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: isActive ? 500 : 400,
                transition: 'background-color 0.2s'
              }}
            >
              <Icon size={18} />
              {item.label}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
