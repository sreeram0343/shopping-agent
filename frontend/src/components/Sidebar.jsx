import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, RefreshCw, AlertCircle, FileText } from 'lucide-react';

export default function Sidebar({
  onImageSearch,
  uploading,
  uploadedImage,
  setUploadedImage,
  backendUrl
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  // Quick test samples from resources
  const sampleImages = [
    { name: 'honey.png', label: '🍯 Organic Honey', desc: 'Find raw organic honey' },
    { name: 'oats.png', label: '🥣 Rolled Oats', desc: 'Find oatmeal products' },
    { name: 'elephant.png', label: '🐘 Random Image', desc: 'Test negative matching' }
  ];

  // Handle Drag Over
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Upload file API helper
  const uploadFile = async (file) => {
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload image');
      }

      const data = await response.json();
      // data contains: { image_path: string, image_url: string, filename: string }
      setUploadedImage(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Handle File Drop
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  // Handle Input File Selection
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  // Trigger File Input Click
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Select a preset sample image
  const selectSample = async (sampleName) => {
    setError(null);
    try {
      // Fetch the sample image from served resources and upload it as a File object
      const imageUrl = `${backendUrl}/resources/${sampleName}`;
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to load sample image');
      
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: blob.type || 'image/png' });
      await uploadFile(file);
    } catch (err) {
      console.error(err);
      setError(`Failed to load sample: ${err.message}`);
    }
  };

  return (
    <aside className="w-80 border-r border-slate-800/80 bg-slate-950/40 p-6 flex flex-col h-full overflow-y-auto">
      {/* Title / Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-600/30">
          <span className="text-xl">🛒</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
            AI Assistant
          </h1>
          <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">
            Smart Personal Shopper
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-xs text-slate-400 leading-relaxed border-b border-slate-900 pb-4">
        Tell me what you want to buy, and I'll search, review, and order the best matching product for you!
      </p>

      {/* Image Search Section */}
      <div className="mt-6 flex-1 flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-indigo-400" />
            Shop by Image
          </h2>
          <p className="mt-1 text-xs text-slate-500 leading-normal">
            Upload a photo of a product, and the AI will analyze it to locate matching items in our store catalog.
          </p>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all duration-300 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/5 shadow-inner'
              : uploadedImage
              ? 'border-slate-800 bg-slate-900/10'
              : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {uploadedImage ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-40 w-full bg-slate-950 flex items-center justify-center">
                <img
                  src={`${backendUrl}${uploadedImage.image_url}`}
                  alt="Uploaded preview"
                  className="max-h-40 object-contain"
                />
              </div>
              <div className="mt-3 flex items-center justify-between w-full text-xs text-slate-400">
                <span className="truncate max-w-[150px] font-mono">{uploadedImage.filename}</span>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition-colors"
                >
                  Remove
                </button>
              </div>
              
              <button
                onClick={onImageSearch}
                disabled={uploading}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Searching Catalog...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Find Similar Products
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center cursor-pointer w-full py-4" onClick={onButtonClick}>
              <div className="rounded-full bg-slate-900 border border-slate-800/80 p-3 text-slate-400 mb-3 group-hover:text-indigo-400">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-slate-300">
                Drag & drop or <span className="text-indigo-400 hover:text-indigo-300">browse</span>
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Supports JPG, JPEG, PNG, WEBP
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-[11px] text-rose-400">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Test Presets */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-3">
            Quick Test Presets
          </h3>
          <div className="flex flex-col gap-2">
            {sampleImages.map((sample) => (
              <button
                key={sample.name}
                onClick={() => selectSample(sample.name)}
                disabled={uploading}
                className="flex items-center gap-3 w-full rounded-xl border border-slate-900/60 bg-slate-950/20 px-3.5 py-2.5 text-left text-xs transition-all hover:bg-slate-900/50 hover:border-slate-800 active:scale-[0.98]"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800/50 flex items-center justify-center text-sm font-mono overflow-hidden">
                  {sample.name.split('.')[0] === 'honey' ? '🍯' : sample.name.split('.')[0] === 'oats' ? '🥣' : '🐘'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-300 truncate">{sample.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{sample.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-6 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
        <span>Vite React Frontend</span>
        <span className="font-mono flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          API Connected
        </span>
      </div>
    </aside>
  );
}
