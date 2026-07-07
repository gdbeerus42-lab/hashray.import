import React from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const VerificationReport = ({ shipment, onBack }) => {
  if (!shipment) return null;

  // We will compare the draft vs original documents
  const drafts = shipment.draftDocuments;
  const originals = shipment.originalDocuments || [];

  const checkMatch = (draft, original) => {
    if (!original) return false;
    // Simple deep equality check for prototype
    return JSON.stringify(draft.data) === JSON.stringify(original.data);
  };

  const verifiedDocs = [];
  const unverifiedDocs = [];

  drafts.forEach(draft => {
    const original = originals.find(o => o.type === draft.type);
    const isMatch = checkMatch(draft, original);
    if (isMatch) {
      verifiedDocs.push({ draft, original, isMatch });
    } else {
      unverifiedDocs.push({ draft, original, isMatch });
    }
  });

  const total = drafts.length;
  const verified = verifiedDocs.length;
  const remaining = unverifiedDocs.length;
  // If there are no originals, percent is 0. Otherwise calculate properly.
  const percent = originals.length === 0 ? 0 : Math.round((verified / total) * 100);

  const renderDocumentCard = ({ draft, original, isMatch }, idx) => {
    return (
      <div key={`${draft.type}-${idx}`} className="card" style={{ borderColor: isMatch ? 'var(--border-color)' : 'var(--status-error)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {draft.type}
            {isMatch ? (
              <CheckCircle2 size={18} color="var(--accent-black)" />
            ) : (
              <AlertCircle size={18} color="var(--status-error)" />
            )}
          </h3>
          <span className={isMatch ? "badge badge-verified" : "badge badge-error"}>
            {isMatch ? 'Verified Match' : 'Discrepancy Found'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Draft Side */}
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
              Draft Data (Expected)
            </div>
            {Object.entries(draft.data).map(([key, value]) => (
              <div key={key} className="data-row">
                <span className="data-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <span className="data-value">{value.toString()}</span>
              </div>
            ))}
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', fontSize: '0.75rem' }}>
              <ExternalLink size={14} /> View Draft PDF
            </button>
          </div>

          {/* Original Side */}
          <div style={{ paddingLeft: '2rem', borderLeft: '1px dashed var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
              Original Data (Actual)
            </div>
            {original ? (
              Object.entries(original.data).map(([key, value]) => {
                const fieldMatch = draft.data[key] === value;
                return (
                  <div key={key} className="data-row">
                    <span className="data-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className="data-value" style={{ color: fieldMatch ? 'inherit' : 'var(--status-error)' }}>
                      {value.toString()}
                      {!fieldMatch && <AlertCircle size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />}
                    </span>
                  </div>
                )
              })
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem 0' }}>
                Document not found in email sync.
              </div>
            )}
            {original && (
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', fontSize: '0.75rem' }}>
                <ExternalLink size={14} /> View Original PDF
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '1.5rem', padding: '0.25rem 0.75rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1>Verification Report: {shipment.id}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Comparing uploaded drafts vs fetched originals for {shipment.supplier}</p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Overall Verification Progress</span>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: percent === 100 ? 'var(--accent-black)' : 'var(--text-primary)' }}>
            {percent}%
          </span>
        </div>
        
        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', backgroundColor: 'var(--accent-black)' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <CheckCircle2 size={20} color="var(--accent-black)" />
            <span><strong>{verified}</strong> Documents Verified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            <Clock size={20} color="var(--text-secondary)" />
            <span><strong>{remaining}</strong> Verification Remaining</span>
          </div>
        </div>
      </div>

      {unverifiedDocs.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-error)', borderBottom: '2px solid var(--status-error)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={24} /> Documents with Discrepancies ({unverifiedDocs.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {unverifiedDocs.map(renderDocumentCard)}
          </div>
        </div>
      )}

      {verifiedDocs.length > 0 && (
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={24} /> Successfully Verified Documents ({verifiedDocs.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {verifiedDocs.map(renderDocumentCard)}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default VerificationReport;
