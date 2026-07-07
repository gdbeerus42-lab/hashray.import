import React, { useState } from 'react';
import { Mail, AlertCircle, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockShipments } from '../mockData';

const VerificationDashboard = ({ onViewReport }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [fetched, setFetched] = useState(false);
  
  const handleFetchEmails = () => {
    setIsFetching(true);
    // Simulate fetching emails and triggering cross-verification
    setTimeout(() => {
      setIsFetching(false);
      setFetched(true);
    }, 2000);
  };

  const getStats = (shipment) => {
    const total = shipment.draftDocuments ? shipment.draftDocuments.length : 0;
    let verified = 0;
    
    if (fetched && shipment.originalDocuments) {
      shipment.draftDocuments.forEach(draft => {
        const original = shipment.originalDocuments.find(o => o.type === draft.type);
        // 100% accurate match check
        if (original && JSON.stringify(draft.data) === JSON.stringify(original.data)) {
          verified++;
        }
      });
    }
    
    const remaining = total - verified;
    return {
      total,
      verified,
      remaining,
      percent: total > 0 ? Math.round((verified / total) * 100) : 0
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1>Verification Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Cross-verify original documents from suppliers against uploaded drafts.</p>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={handleFetchEmails}
          disabled={isFetching || fetched}
          style={{ opacity: isFetching ? 0.7 : 1 }}
        >
          {isFetching ? <RefreshCw className="animate-spin" size={18} /> : <Mail size={18} />}
          <span style={{ marginLeft: '0.5rem' }}>{isFetching ? 'Scanning Emails...' : fetched ? 'Emails Synced' : 'Sync Emails & Verify'}</span>
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h2 style={{ margin: 0 }}>Active Contracts</h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track document verification progress</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mockShipments.map((shipment) => {
            const stats = getStats(shipment);
            return (
              <div 
                key={shipment.id}
                onClick={() => onViewReport(shipment)}
                style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--accent-black)' }}>{shipment.id}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Supplier: {shipment.supplier}</div>
                  </div>
                  
                  <button 
                    className="btn btn-outline"
                    onClick={(e) => { e.stopPropagation(); onViewReport(shipment); }}
                    style={{ minWidth: '140px' }}
                  >
                    View Details
                  </button>
                </div>
                
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Contract Verification Progress</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: stats.percent === 100 ? 'var(--accent-black)' : 'var(--text-primary)' }}>
                      {stats.percent}%
                    </span>
                  </div>
                  
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ height: '100%', backgroundColor: 'var(--accent-black)' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: stats.verified > 0 ? 'var(--accent-black)' : 'var(--text-tertiary)' }}>
                      <CheckCircle2 size={16} color="currentColor" />
                      <span><strong>{stats.verified}</strong> Documents Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <Clock size={16} color="currentColor" />
                      <span><strong>{stats.remaining}</strong> Verification Remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Show alert if ANY shipment has a discrepancy after fetch */}
      {fetched && mockShipments.some(s => getStats(s).remaining > 0) && (
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ marginTop: '2rem', borderColor: 'var(--status-error)' }}
         >
           <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
             <AlertCircle color="var(--status-error)" style={{ marginTop: '0.125rem' }} />
             <div>
               <h3 style={{ color: 'var(--status-error)', marginBottom: '0.5rem' }}>Discrepancies Detected</h3>
               <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                 Our automated cross-verification engine found mismatches in one or more active contracts. Please review the detailed reports for the affected contracts.
               </p>
             </div>
           </div>
         </motion.div>
      )}
    </motion.div>
  );
};

export default VerificationDashboard;
