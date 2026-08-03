import React, { useRef, useState, useEffect } from 'react';
import { PenTool, CheckCircle2, RotateCcw, Lock, Upload } from 'lucide-react';

const SignatureCanvas = ({ onSave, initialUrl = null, title = 'Digital E-Signature' }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLocked, setIsLocked] = useState(!!initialUrl);
  const [signatureUrl, setSignatureUrl] = useState(initialUrl);

  useEffect(() => {
    setSignatureUrl(initialUrl);
    setIsLocked(!!initialUrl);
  }, [initialUrl]);

  const startDrawing = (e) => {
    if (isLocked) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || isLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || isLocked) return;
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureUrl(null);
    setIsLocked(false);
    if (onSave) onSave(null);
  };

  const handleLockAndVerify = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setSignatureUrl(dataUrl);
      setIsLocked(true);
      if (onSave) onSave(dataUrl);
    } else if (signatureUrl) {
      setIsLocked(true);
      if (onSave) onSave(signatureUrl);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureUrl(reader.result);
        setIsLocked(true);
        if (onSave) onSave(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-blue-600" />
          {title}
        </span>
        <div className="flex items-center gap-2">
          {!isLocked && (
            <label className="cursor-pointer text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" /> Upload Image
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
          {signatureUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear Signature
            </button>
          )}
        </div>
      </div>

      {isLocked && signatureUrl ? (
        <div className="p-4 bg-white border border-emerald-200 rounded-xl flex items-center justify-between shadow-xs">
          <img src={signatureUrl} alt="Verified Digital Signature" className="h-14 object-contain max-w-xs" />
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Locked & Verified
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-1 bg-white">
            <canvas
              ref={canvasRef}
              width={500}
              height={120}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-28 bg-white rounded-lg cursor-crosshair"
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-slate-400">Draw signature with mouse or touchscreen</span>
            <button
              type="button"
              onClick={handleLockAndVerify}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Lock className="w-3 h-3" /> Lock & Verify Signature
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureCanvas;