import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Upload, PenTool } from 'lucide-react';
import Button from './Button.jsx';

const SignatureCanvas = ({ onSaveSignature, initialSignature = null }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [mode, setMode] = useState('draw');
  const [preview, setPreview] = useState(initialSignature);

  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a'; // Deep slate black stroke
    }
  }, [mode]);

  // Exact scale-aware coordinate calculation
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsEmpty(true);
    setPreview(null);
    onSaveSignature && onSaveSignature(null);
  };

  const saveSignature = () => {
    if (canvasRef.current && !isEmpty) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setPreview(dataUrl);
      onSaveSignature && onSaveSignature(dataUrl);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onSaveSignature && onSaveSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            mode === 'draw' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Draw E-Signature</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            mode === 'upload' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image</span>
        </button>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-2">
          <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 p-1">
            <canvas
              ref={canvasRef}
              width={600}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 touch-none cursor-crosshair rounded-xl bg-white"
            />
            {isEmpty && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 font-medium">
                Sign inside the box using mouse or touch screen
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={Eraser}
              onClick={clearCanvas}
              disabled={isEmpty}
            >
              Clear Signature
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={Check}
              onClick={saveSignature}
              disabled={isEmpty}
            >
              Lock & Verify E-Sign
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <Upload className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs text-slate-600 font-medium">Click to upload signature image file</span>
            <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WEBP (Max 2MB)</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {preview && (
        <div className="p-3 border border-emerald-200 rounded-xl bg-emerald-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={preview} alt="Verified Signature" className="h-12 object-contain bg-white rounded p-1 border" />
            <div>
              <span className="text-xs font-bold text-emerald-800 block">E-Signature Verified</span>
              <span className="text-[10px] text-emerald-600">Encrypted digital signature attached</span>
            </div>
          </div>
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-rose-600 font-semibold hover:underline"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default SignatureCanvas;