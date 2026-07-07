import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Mail, RefreshCw, FileSignature } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockShipments } from '../mockData';

const UploadDrafts = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isFetchingEmail, setIsFetchingEmail] = useState(false);
  const shipment = mockShipments[0]; // Using first mock for prototype

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setTimeout(() => {
      setUploaded(true);
    }, 1000);
  };

  const simulateEmailFetch = () => {
    setIsFetchingEmail(true);
    setTimeout(() => {
      setIsFetchingEmail(false);
      setUploaded(true);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="upload-view"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Draft Documents & Contracts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Provide draft shipping documents and the drafted contract for verification prep.</p>
        </div>
        <div className="badge badge-pending">Shipment: {shipment.id}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Manual Upload Option */}
        <div 
          className="dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ borderColor: isDragging ? 'var(--accent-black)' : 'var(--border-color)', backgroundColor: isDragging ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <UploadCloud size={48} color={isDragging ? 'var(--accent-black)' : 'var(--text-secondary)'} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Manual Upload</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Drag & drop PDFs or click to browse</p>
          <button className="btn btn-outline" onClick={simulateUpload}>Browse Files</button>
        </div>

        {/* Email Fetch Option */}
        <div 
          className="card"
          style={{ backgroundColor: 'var(--bg-secondary)', textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '2px dashed var(--border-color)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Mail size={48} color="var(--text-secondary)" />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Fetch from Email</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Auto-sync drafts sent to drafts@metallora.com</p>
          <button 
            className="btn btn-primary" 
            onClick={simulateEmailFetch}
            disabled={isFetchingEmail}
            style={{ opacity: isFetchingEmail ? 0.7 : 1 }}
          >
            {isFetchingEmail ? <RefreshCw className="animate-spin" size={18} /> : <Mail size={18} />}
            <span style={{ marginLeft: '0.5rem' }}>{isFetchingEmail ? 'Scanning Inbox...' : 'Sync Email Drafts'}</span>
          </button>
        </div>
      </div>

      {uploaded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {/* Drafted Contract Terms Section */}
          <div className="card" style={{ borderLeft: '4px solid var(--accent-black)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <FileSignature color="var(--accent-black)" />
              <h2 style={{ margin: 0 }}>Drafted Contract Details</h2>
              <span className="badge badge-verified" style={{ marginLeft: 'auto' }}>Contract Parsed</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Key Terms</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(shipment.contractDetails).map(([key, value]) => (
                    <div key={key} className="data-row" style={{ padding: '0.5rem 0' }}>
                      <span className="data-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span className="data-value">{value.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '6px' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Norms & Conditions</h3>
                <ul style={{ fontSize: '0.875rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Valid for 30-45 days from draft issue.</li>
                  <li>Container must be loaded post contract confirmation.</li>
                  <li>Payment triggers release of documents from bank.</li>
                  <li>Detention charges applicable after 14 days of unloading.</li>
                  <li>Final Destination: ICD Khodiyar via Shipping Line.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Drafted Documents List Section */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <CheckCircle2 color="var(--accent-black)" />
              <h2 style={{ margin: 0 }}>Drafted Documents</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {shipment.draftDocuments.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                  <FileText size={24} color="var(--text-secondary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{doc.type}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Draft Parsed</div>
                  </div>
                  <span className="badge badge-verified">Parsed</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadDrafts;
