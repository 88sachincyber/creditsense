import { useState, useRef } from "react";
import API from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400&display=swap');

  .upload-root {
    background: #0a0a0a;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    position: relative; overflow: hidden;
  }

  .upload-bg-grid {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .upload-glow {
    position: fixed; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(232,196,104,0.06) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    pointer-events: none;
  }

  .upload-card {
    position: relative; z-index: 1;
    width: 520px;
    background: #111; border: 1px solid #222;
    padding: 52px 48px 44px;
    animation: uploadFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes uploadFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .upload-corner { position: absolute; width: 14px; height: 14px; border-color: #e8c468; border-style: solid; }
  .upload-corner.tl { top:-1px; left:-1px;   border-width: 2px 0 0 2px; }
  .upload-corner.tr { top:-1px; right:-1px;  border-width: 2px 2px 0 0; }
  .upload-corner.bl { bottom:-1px; left:-1px;  border-width: 0 0 2px 2px; }
  .upload-corner.br { bottom:-1px; right:-1px; border-width: 0 2px 2px 0; }

  .upload-eyebrow {
    font-size: 10px; letter-spacing: 0.2em;
    color: #e8c468; text-transform: uppercase; margin-bottom: 10px;
  }

  .upload-heading {
    font-family: 'Playfair Display', serif;
    font-size: 30px; font-weight: 700; color: #f5f0e8;
    letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 32px;
  }

  /* Drop zone */
  .upload-dropzone {
    border: 1px dashed #2a2a2a;
    padding: 40px 24px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 14px; cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    margin-bottom: 24px;
  }

  .upload-dropzone:hover,
  .upload-dropzone.drag-over {
    border-color: #e8c468;
    background: rgba(232,196,104,0.03);
  }

  .upload-dz-icon {
    width: 52px; height: 52px;
    border: 1px solid #2a2a2a;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    transition: border-color 0.25s;
  }

  .upload-dropzone:hover .upload-dz-icon { border-color: rgba(232,196,104,0.35); }

  .upload-dz-primary { font-size: 13px; color: #f5f0e8; letter-spacing: 0.04em; }
  .upload-dz-primary span { color: #e8c468; }
  .upload-dz-secondary { font-size: 10px; color: #444; letter-spacing: 0.1em; }

  .upload-dz-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .upload-dz-tag {
    font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
    color: #555; border: 1px solid #1e1e1e; padding: 3px 10px;
  }

  /* File info row */
  .upload-file-info {
    background: #0d0d0d; border: 1px solid #1e1e1e;
    padding: 16px 18px; margin-bottom: 24px;
    display: flex; align-items: center; gap: 14px;
  }

  .upload-file-icon { font-size: 20px; }
  .upload-file-name {
    font-size: 12px; color: #f5f0e8; flex: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .upload-file-size { font-size: 10px; color: #444; flex-shrink: 0; }
  .upload-file-remove {
    font-size: 14px; color: #444; cursor: pointer;
    background: none; border: none; font-family: inherit;
    transition: color 0.2s; padding: 0;
  }
  .upload-file-remove:hover { color: #c45454; }

  /* Progress */
  .upload-progress { margin-bottom: 24px; }
  .upload-progress-label {
    display: flex; justify-content: space-between;
    font-size: 10px; color: #555; letter-spacing: 0.1em; margin-bottom: 8px;
  }
  .upload-progress-bar { height: 2px; background: #1a1a1a; }
  .upload-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #a88030, #e8c468);
    transition: width 0.3s ease;
  }

  /* Button */
  .upload-btn {
    width: 100%; background: #e8c468; color: #0a0a0a;
    border: none; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 16px; cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .upload-btn:hover:not(:disabled) { background: #f0d080; }
  .upload-btn:active:not(:disabled) { transform: scale(0.99); }
  .upload-btn:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; }

  .upload-hint {
    margin-top: 18px; font-size: 10px; color: #333;
    letter-spacing: 0.08em; text-align: center;
  }
`;

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function UploadStatement() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setProgress(0);
    setDone(false);
    setError("");
  };

  const handleRemove = () => {
    setFile(null);
    setProgress(0);
    setDone(false);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── business logic untouched ──
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError("");

    // Simulate progress while the real request runs
    const timer = setInterval(() => {
      setProgress((p) => (p >= 85 ? p : p + Math.random() * 15));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      await API.post("/transactions/upload", formData);
      clearInterval(timer);
      setProgress(100);
      setDone(true);
      alert("Uploaded Successfully");
    } catch (err) {
      clearInterval(timer);
      const message = err?.response?.data?.error || "Upload failed. Please check your statement format.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="upload-root">
        <div className="upload-bg-grid" />
        <div className="upload-glow" />

        <div className="upload-card">
          <div className="upload-corner tl" /><div className="upload-corner tr" />
          <div className="upload-corner bl" /><div className="upload-corner br" />

          <p className="upload-eyebrow">Statement Upload</p>
          <h2 className="upload-heading">Upload Bank<br />Statement.</h2>

          {/* Hidden input */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.csv"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {/* Drop zone — hidden once file selected */}
          {!file && (
            <div
              className={`upload-dropzone${dragging ? " drag-over" : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-dz-icon">📄</div>
              <p className="upload-dz-primary">
                Drop your file here or <span>browse</span>
              </p>
              <p className="upload-dz-secondary">Supports PDF, CSV</p>
              <div className="upload-dz-tags">
                <span className="upload-dz-tag">PDF</span>
                <span className="upload-dz-tag">CSV</span>
              </div>
            </div>
          )}

          {/* File info */}
          {file && (
            <div className="upload-file-info">
              <span className="upload-file-icon">📎</span>
              <span className="upload-file-name">{file.name}</span>
              <span className="upload-file-size">{formatSize(file.size)}</span>
              {!uploading && (
                <button className="upload-file-remove" onClick={handleRemove}>✕</button>
              )}
            </div>
          )}

          {/* Progress bar */}
          {(uploading || done) && (
            <div className="upload-progress">
              <div className="upload-progress-label">
                <span>{done ? "Upload complete" : "Uploading..."}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="upload-progress-bar">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file || uploading || done}
          >
            {done ? "Uploaded ✓" : uploading ? "Uploading..." : "Upload Statement →"}
          </button>

          {error && (
            <p style={{ marginTop: "14px", color: "#d26b6b", fontSize: "11px", lineHeight: 1.4 }}>
              {error}
            </p>
          )}

          <p className="upload-hint">Your data is encrypted and never shared.</p>
        </div>
      </div>
    </>
  );
}

export default UploadStatement;