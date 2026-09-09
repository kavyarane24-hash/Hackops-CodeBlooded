import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';
import './FileUpload.css';

/**
 * Reusable FileUpload Component
 * Accepts dragged files or manual selection, showing file preview feedback
 */
const FileUpload = ({ label, description, accept = ".pdf,.csv,.png,.jpg", onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="file-upload-wrapper">
      {label && <label className="file-upload-label">{label}</label>}

      {!selectedFile ? (
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="upload-icon" size={36} />
          <div className="upload-text">
            <span className="bold-text">Click to upload</span> or drag and drop
          </div>
          <p className="upload-desc">{description || `PDF, CSV, or images up to 10MB (${accept})`}</p>
          <input
            type="file"
            className="hidden-file-input"
            accept={accept}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="file-preview-card">
          <div className="file-info">
            <FileText className="file-type-icon" size={24} />
            <div className="file-details">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for AI Parse</span>
            </div>
          </div>
          <div className="file-actions">
            <CheckCircle className="success-icon" size={20} />
            <button type="button" className="remove-btn" onClick={removeFile} title="Remove file">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
