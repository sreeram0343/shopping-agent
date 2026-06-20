import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Sparkles, Home, Compass, Sliders, Tag, Heart, History, 
  Bell, Sun, Moon, ChevronRight, ArrowRight, Send, Star, 
  Search, Info, Shield, Cpu, Menu, Signal, Wifi, Battery, 
  Camera, X, RefreshCw, Smartphone, Check, HelpCircle, 
  Settings, User, Trash2, FolderPlus, HelpCircle as HelpIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatArea from './components/ChatArea';
import ProductCard from './components/ProductCard';
import GravityCore from './components/GravityCore';
import HexagonalRadarChart from './components/HexagonalRadarChart';
import FloatingElements from './components/FloatingElements';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const priceHistoryData = [
  { date: 'May 1', price: 22500 },
  { date: 'May 15', price: 21500 },
  { date: 'Jun 1', price: 17499 },
  { date: 'Jun 15', price: 19990 }
];

// Mock headphones data
const initialHeadphones = [
  { id: 101, number: 1, name: "Sony WH-1000XM5", price: 19990, rating: 4.6, tag: "Best Overall", color: "#6C5CE7", category: "headphones" },
  { id: 102, number: 2, name: "Bose QuietComfort 45", price: 18490, rating: 4.4, tag: "Best Comfort", color: "#C2410C", category: "headphones" },
  { id: 103, number: 3, name: "Sennheiser Momentum 4", price: 17999, rating: 4.3, tag: "Best Sound", color: "#047857", category: "headphones" },
  { id: 104, number: 4, name: "JBL Tour One M2", price: 15999, rating: 4.3, tag: "Best Value", color: "#1D4ED8", category: "headphones" }
];

// Canvas drawing of abstract rotating 3D Rune Symbol
function RuneCanvas() {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.width = 180;
    let height = canvas.height = 180;

    let angleX = 0;
    let angleY = 0;
    let targetSpeed = 0.006;
    let currentSpeed = 0.006;

    // 3D coordinates for a double-pyramid/diamond (Rune shape)
    const vertices = [
      {x: 0, y: -50, z: 0},   // Top
      {x: 0, y: 50, z: 0},    // Bottom
      {x: -30, y: 0, z: -30}, // Corners
      {x: 30, y: 0, z: -30},
      {x: 30, y: 0, z: 30},
      {x: -30, y: 0, z: 30}
    ];

    const edges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 3], [3, 4], [4, 5], [5, 2]
    ];

    // Glow particles drifting around
    const particles = [];
    for(let i=0; i<25; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        z: (Math.random() - 0.5) * 120,
        speed: 0.15 + Math.random() * 0.3,
        size: 1 + Math.random() * 1.5
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Glow center
      const radial = ctx.createRadialGradient(width/2, height/2, 5, width/2, height/2, 70);
      radial.addColorStop(0, hovered ? 'rgba(108, 92, 231, 0.12)' : 'rgba(108, 92, 231, 0.04)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(width/2, height/2, 75, 0, Math.PI * 2);
      ctx.fill();

      // Spin update
      targetSpeed = hovered ? 0.025 : 0.006;
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;
      angleX += currentSpeed;
      angleY += currentSpeed * 1.3;

      // Project vertices
      const projected = vertices.map(v => {
        let y1 = v.y * Math.cos(angleX) - v.z * Math.sin(angleX);
        let z1 = v.y * Math.sin(angleX) + v.z * Math.cos(angleX);
        
        let x2 = v.x * Math.cos(angleY) - z1 * Math.sin(angleY);
        let z2 = v.x * Math.sin(angleY) + z1 * Math.cos(angleY);

        const dist = 200;
        const scale = dist / (dist + z2);
        return {
          x: x2 * scale + width / 2,
          y: y1 * scale + height / 2
        };
      });

      // Drifting particles
      particles.forEach(p => {
        p.y -= p.speed;
        if(p.y < -80) p.y = 80;

        let z1 = p.z;
        let x2 = p.x * Math.cos(0.003) - z1 * Math.sin(0.003);
        p.x = x2;

        const dist = 200;
        const scale = dist / (dist + p.z);
        const px = p.x * scale + width / 2;
        const py = p.y * scale + height / 2;

        ctx.fillStyle = hovered ? 'rgba(139, 92, 246, 0.5)' : 'rgba(108, 92, 231, 0.22)';
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI*2);
        ctx.fill();
      });

      // Draw wireframe edges
      ctx.strokeStyle = hovered ? '#8B5CF6' : '#6C5CE7';
      ctx.lineWidth = hovered ? 2 : 1.3;
      ctx.shadowBlur = hovered ? 12 : 5;
      ctx.shadowColor = '#6C5CE7';

      edges.forEach(([u, v]) => {
        ctx.beginPath();
        ctx.moveTo(projected[u].x, projected[u].y);
        ctx.lineTo(projected[v].x, projected[v].y);
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [hovered]);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center pointer-events-auto"
    >
      <canvas ref={canvasRef} className="w-44 h-44 transition-transform duration-500 hover:scale-105" />
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('I need the best noise cancelling headphones under ₹20,000 for work and travel');
  const [isSearching, setIsSearching] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [activeNav, setActiveNav] = useState('home'); // home, explore, compare, history, wishlist, deals, settings, profile, chat
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Smart Search'); // Smart Search, Compare, Explain
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  
  // Image Search variables
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  // Wishlist variables
  const [wishlistItems, setWishlistItems] = useState([
    { id: 101, name: "Sony WH-1000XM5", price: 19990, rating: 4.6, folder: "Electronics", tag: "High Priority" },
    { id: 103, name: "Sennheiser Momentum 4", price: 17999, rating: 4.3, folder: "Electronics", tag: "Waiting for Sale" },
    { id: 1, name: "Organic Raw Honey", price: 14.99, folder: "Groceries", tag: "Organic Pick" }
  ]);
  const [newFolderName, setNewFolderName] = useState('');
  const [activeWishlistFolder, setActiveWishlistFolder] = useState('All');
  const [wishlistFolders, setWishlistFolders] = useState(["Electronics", "Groceries", "Favorites"]);

  // Comparison Workspace
  const [compareList, setCompareList] = useState(initialHeadphones.slice(0, 3));

  const fileInputRef = useRef(null);

  // Apply dark mode class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Spotlight search keyboard listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSpotlight(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowSpotlight(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Verify backend health
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then((res) => {
        if (res.ok) setApiConnected(true);
      })
      .catch((err) => {
        console.error('Backend connection failed:', err);
        setApiConnected(false);
      });
  }, []);

  // Submit request to FastAPI
  const sendChatRequest = async (updatedMessages) => {
    setIsSearching(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      if (!response.ok) throw new Error('Agent failed to respond');

      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ I encountered an error connecting to the AI agent server. Please make sure the backend Python server is running on port 8000.'
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  // Submit chat query
  const handleSearchSubmit = async (queryText) => {
    const text = queryText || inputValue;
    if (!text.trim() || isSearching) return;

    setActiveNav('chat');
    setShowSpotlight(false);
    
    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    if (!queryText) setInputValue('');

    await sendChatRequest(updatedMessages);
  };

  // Handle preset clicks (e.g. from the list of suggestions)
  const handleSuggestionClick = (query) => {
    setInputValue(query);
    handleSearchSubmit(query);
  };

  // File Upload Helper
  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${BACKEND_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Failed to upload image');
        }

        const data = await response.json();
        setUploadedImage(data);
      } catch (err) {
        console.error(err);
        setUploadError(err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  // Preset demo image upload
  const handlePresetSelect = async (sampleName) => {
    setUploading(true);
    setUploadError(null);
    try {
      const imageUrl = `${BACKEND_URL}/resources/${sampleName}`;
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to load sample image');
      
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: blob.type || 'image/png' });
      
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) throw new Error('Upload error');
      const data = await uploadRes.json();
      setUploadedImage(data);
    } catch (err) {
      console.error(err);
      setUploadError(`Failed to load preset: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Trigger Image search
  const handleImageSearch = async (imageObj) => {
    if (!imageObj || isSearching) return;
    setActiveNav('chat');
    const prompt = `I uploaded a product image. Please analyze it and find similar products in the store. Image path: ${imageObj.image_path}`;
    const userMessage = {
      role: 'user',
      content: prompt,
      imageUrl: imageObj.image_url,
      filename: imageObj.filename
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUploadedImage(null);
    await sendChatRequest(updatedMessages);
  };

  const handleOrder = async (number, id) => {
    if (isSearching) return;
    setActiveNav('chat');
    const userMessage = { role: 'user', content: `order number ${number}` };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await sendChatRequest(updatedMessages);
  };

  const startNewChat = () => {
    setMessages([]);
    setInputValue('I need the best noise cancelling headphones under ₹20,000 for work and travel');
    setUploadedImage(null);
    setActiveNav('home');
  };

  // Save product to Wishlist
  const handleProductSave = (product) => {
    const exists = wishlistItems.some(i => i.id === product.id);
    if (exists) {
      setWishlistItems(prev => prev.filter(i => i.id !== product.id));
    } else {
      setWishlistItems(prev => [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        rating: product.rating,
        folder: "Favorites",
        tag: "Saved Item"
      }]);
    }
  };

  // Manage Wishlist folders
  const handleAddFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim() && !wishlistFolders.includes(newFolderName.trim())) {
      setWishlistFolders(prev => [...prev, newFolderName.trim()]);
      setNewFolderName('');
    }
  };

  // Redraw mock headphone icon representation
  const renderHeadphoneIcon = (color) => (
    <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke={color || "#6C5CE7"} strokeWidth="1.5">
      <path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9" />
      <path d="M4 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" fill={`${color}10`} />
      <path d="M16 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" fill={`${color}10`} />
    </svg>
  );

  return (
    <div className="relative min-h-screen w-screen flex bg-[#030310] bg-space-radial text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Dynamic Floating Zero-Gravity Elements Layer */}
      <FloatingElements />
      {/* ⌘K Spotlight Command Palette Modal */}
      <AnimatePresence>
        {showSpotlight && (
          <div className="fixed inset-0 bg-[#000000]/40 dark:bg-black/80 backdrop-blur-xs flex items-start justify-center pt-28 z-[999] px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              className="w-full max-w-lg bg-white dark:bg-[#0E0E0F] border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4.5 border-b border-black/[0.06] dark:border-white/[0.08]">
                <Search className="h-4.5 w-4.5 text-[#707070] dark:text-[#8E8E93]" />
                <input 
                  type="text"
                  value={spotlightQuery}
                  onChange={(e) => setSpotlightQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(spotlightQuery);
                      setSpotlightQuery('');
                    }
                  }}
                  placeholder="Ask Rune anything... (e.g. laptop, running shoes)"
                  className="w-full bg-transparent px-3 py-4 text-sm text-[#111111] dark:text-white outline-none placeholder-[#707070]"
                  autoFocus
                />
                <button 
                  onClick={() => setShowSpotlight(false)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-black/[0.03] dark:bg-white/5 font-semibold text-[#707070]"
                >
                  ESC
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <span className="text-[10px] font-extrabold text-[#707070] uppercase tracking-wider">Suggested Searches</span>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Best noise cancelling headphones under ₹20,000",
                    "Compare iPhone vs Samsung phone specs",
                    "Find organic wildflower honey with 4.5+ rating",
                    "Best mechanical keyboards for work"
                  ].map((sug, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        handleSearchSubmit(sug);
                        setSpotlightQuery('');
                      }}
                      className="flex items-center justify-between text-xs font-semibold text-[#111111] dark:text-slate-200 text-left px-3 py-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/5 w-full cursor-pointer"
                    >
                      <span>{sug}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#707070]" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MINIMAL NAV SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 h-screen flex-shrink-0 flex-col justify-between p-6 border-r border-white/5 bg-black/35 backdrop-blur-md z-20 relative">
        <div className="flex flex-col gap-6.5 overflow-y-auto pr-1">
          
          {/* Logo block */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-650 text-black font-black text-lg shadow-sm shadow-cyan-400/20 select-none">
              R
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white">Rune AI</h1>
              <p className="text-[10px] text-slate-450 font-semibold leading-none">Intelligence Behind Every Purchase.</p>
            </div>
          </div>

          {/* New Chat pill */}
          <button 
            onClick={startNewChat}
            className="w-full flex items-center justify-between rounded-full border border-white/10 bg-white/3 hover:bg-white/8 px-4.5 py-3 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98 text-cyan-300"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-cyan-400" />
              <span>New Chat</span>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-cyan-450" />
          </button>

          {/* Nav List */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'explore', label: 'Explore', icon: Compass },
              { id: 'compare', label: 'Compare', icon: Sliders },
              { id: 'history', label: 'History', icon: History },
              { id: 'wishlist', label: 'Wishlist', icon: Heart },
              { id: 'deals', label: 'Deals', icon: Tag },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id || (item.id === 'home' && activeNav === 'chat');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'home' && messages.length > 0) {
                      setActiveNav('chat');
                    } else {
                      setActiveNav(item.id);
                    }
                  }}
                  className={`flex items-center gap-3.5 w-full px-4.5 py-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/10 border-cyan-400/20 text-cyan-400' 
                      : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer profile block */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4.5">
          <div className="flex items-center gap-2.5">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" 
              alt="Ram Avatar" 
              className="h-9 w-9 rounded-full object-cover border border-white/10" 
            />
            <div className="leading-tight">
              <h4 className="text-xs font-bold text-white">Ram 👋</h4>
              <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">Pro Tier</span>
            </div>
          </div>
          <button 
            onClick={() => setShowSpotlight(true)}
            className="p-1.5 rounded-lg border border-white/10 bg-white/3 text-xs font-mono text-slate-400 hover:bg-white/8 cursor-pointer"
            title="Search palette"
          >
            ⌘K
          </button>
        </div>
      </aside>

      {/* CORE DISPLAY (Main panel + Right Column Insights if needed) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-black/25 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-xl border border-white/5 text-slate-400">
              <Menu className="h-4.5 w-4.5" />
            </button>
            
            {/* Apple-style Spotlight placeholder */}
            <div 
              onClick={() => setShowSpotlight(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 bg-white/3 hover:bg-white/8 cursor-pointer transition-all min-w-[240px] text-xs text-slate-450"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search Rune AI...</span>
              <span className="ml-auto text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Bell notifications */}
            <button className="relative p-2.5 rounded-full bg-white/3 border border-white/5 text-slate-405 cursor-pointer hover:bg-white/8">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-cyan-400 bg-glow-cyan" />
            </button>

            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" 
              alt="Profile" 
              className="h-8.5 w-8.5 rounded-full object-cover border-2 border-white/10"
            />
          </div>
        </header>

        {/* Views Router Wrapper */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-transparent relative z-10">
          
          {/* Main workspace frame */}
          <div className="flex-1 flex flex-col overflow-y-auto p-6 pb-20 gap-6">
            
            {activeNav === 'home' && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-4"
              >
                
                {/* Greeting & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel rounded-[24px] p-6 relative overflow-hidden">
                  
                  {/* Decorative glowing background mesh */}
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />
                  
                  <div className="flex-1">
                    <h2 className="text-3xl font-extrabold font-serif tracking-tight leading-tight text-white">Hello, Ram 👋</h2>
                    <p className="text-base text-slate-400 mt-1 font-medium">What can Rune AI help you discover today?</p>
                  </div>

                  <RuneCanvas />
                </div>

                {/* AI Prompt Box (Landing Page Style) */}
                <div className="rounded-[24px] glass-panel p-5 flex flex-col gap-4 relative">
                  
                  <div className="relative">
                    <textarea 
                      rows={2}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="I need the best noise cancelling headphones under ₹20,000 for work and travel..."
                      className="w-full text-base font-semibold text-white placeholder-slate-500 resize-none outline-none border-none pr-14"
                    />

                    {/* Animated Send Button */}
                    <button
                      onClick={() => handleSearchSubmit()}
                      disabled={isSearching || !inputValue.trim()}
                      className="absolute right-0 bottom-2 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-purple-650 text-white shadow-md shadow-cyan-400/20 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Options bar under prompt input */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      {[
                        { name: 'Smart Search', icon: Sparkles },
                        { name: 'Compare', icon: Sliders },
                        { name: 'Explain', icon: Info }
                      ].map((mode) => {
                        const Icon = mode.icon;
                        const isSel = selectedMode === mode.name;
                        return (
                          <button
                            key={mode.name}
                            onClick={() => setSelectedMode(mode.name)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300' 
                                : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/8'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{mode.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Image Upload Trigger */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-300 px-4 py-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Shop by Image</span>
                    </button>
                  </div>
                  
                  {/* Preset uploads block */}
                  <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-500 border-t border-white/5 overflow-x-auto select-none">
                    <span className="font-extrabold uppercase shrink-0">Upload Demos:</span>
                    <button onClick={() => handlePresetSelect('honey.png')} className="shrink-0 underline hover:text-[#6C5CE7]">🍯 Honey Preset</button>
                    <button onClick={() => handlePresetSelect('oats.png')} className="shrink-0 underline hover:text-[#6C5CE7]">🥣 Oats Preset</button>
                    <button onClick={() => handlePresetSelect('elephant.png')} className="shrink-0 underline hover:text-[#6C5CE7]">🐘 Neg Test</button>
                  </div>

                  {uploadedImage && (
                    <div className="flex items-center justify-between border border-[#6C5CE7]/20 bg-[#EDE9FE]/20 rounded-xl px-3 py-1.5 text-xs text-[#6C5CE7] dark:text-[#9E91FF] animate-slide-up mt-1">
                      <div className="flex items-center gap-2 truncate">
                        <Camera className="h-3.5 w-3.5" />
                        <span className="font-bold truncate">{uploadedImage.filename}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleImageSearch(uploadedImage)}
                          className="font-extrabold underline text-[#6C5CE7] hover:text-[#5B4EBF]"
                        >
                          Find Similar Products
                        </button>
                        <button onClick={() => setUploadedImage(null)}>
                          <X className="h-3.5 w-3.5 text-rose-500 hover:scale-105 transition-all" />
                        </button>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="text-rose-500 font-medium text-[11px]">
                      {uploadError}
                    </div>
                  )}

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Preset suggestions pills under prompt */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Best gaming laptop under ₹1,00,000",
                    "Compare iPhone vs Samsung",
                    "Best Mechanical Keyboard",
                    "Best Camera Phone",
                    "Best Running Shoes"
                  ].map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(query)}
                      className="px-4 py-2 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0A0A0A] hover:bg-black/[0.02] dark:hover:bg-white/5 text-xs font-semibold text-[#707070] dark:text-slate-350 cursor-pointer shadow-xs transition-all"
                    >
                      {query}
                    </button>
                  ))}
                </div>

                {/* Top Recommendations */}
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold">Top Recommendations</h3>
                    <button 
                      onClick={() => handleSearchSubmit("Show product recommendations for headphones")}
                      className="text-xs font-bold text-[#707070] hover:text-[#6C5CE7] flex items-center gap-1"
                    >
                      <span>View all</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    {initialHeadphones.map((hp) => (
                      <ProductCard 
                        key={hp.id} 
                        product={hp} 
                        onOrder={handleOrder}
                        onSave={handleProductSave}
                        onCompare={(p) => {
                          setActiveNav('compare');
                          setCompareList(prev => {
                            if (prev.find(x => x.id === p.id)) return prev;
                            return [...prev, p].slice(-3);
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Dashboard Data Visualizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  
                  {/* Price Tracker Graph */}
                  <div className="glass-panel rounded-[24px] p-5 flex flex-col justify-between min-h-[300px]">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Price Trend Analytics</h3>
                        <span className="text-[9px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 rounded-full">
                          LIVE VALUE
                        </span>
                      </div>

                      {/* Active Product inline specs */}
                      <div className="flex items-center justify-between bg-white/3 p-3 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-lg">
                            🎧
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-extrabold text-white truncate">Sony WH-1000XM5</h4>
                            <p className="text-[9px] text-slate-500 mt-0.5">Historical Low: ₹17,499</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-white">₹19,990</span>
                          <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 rounded px-1.5 ml-1.5">↓12%</span>
                        </div>
                      </div>

                      {/* LineChart visualization */}
                      <div className="pt-2">
                        <ResponsiveContainer width="100%" height={120}>
                          <LineChart data={priceHistoryData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" stroke="#707070" fontSize={8} tickLine={false} axisLine={false} />
                            <YAxis stroke="#707070" fontSize={8} tickFormatter={(v) => `₹${v/1000}k`} tickLine={false} axisLine={false} />
                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Price']} contentStyle={{ background: '#08071e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '9px' }} />
                            <Line type="monotone" dataKey="price" stroke="#00F2FE" strokeWidth={2.5} dot={{ r: 4, fill: '#00F2FE', strokeWidth: 0 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSearchSubmit("Start tracking price for Sony WH-1000XM5")}
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/2 hover:bg-cyan-500/10 hover:text-cyan-300 py-3 text-xs font-bold transition-all cursor-pointer active:scale-98"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      <span>Notify Price Drop</span>
                    </button>
                  </div>

                  {/* Audio Specs Radar Chart */}
                  <div className="glass-panel rounded-[24px] p-5 min-h-[300px]">
                    <HexagonalRadarChart />
                  </div>

                </div>

                {/* Quick Comparison spec grid table */}
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">Quick Comparison</h3>
                    <button 
                      onClick={() => handleSearchSubmit("Compare Sony XM5, Bose QC45, Sennheiser Momentum 4")}
                      className="flex items-center gap-1.5 rounded-full bg-white/3 border border-white/5 px-3.5 py-1.5 text-xs font-bold hover:bg-white/8 transition-all cursor-pointer text-cyan-300"
                    >
                      <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Compare All</span>
                    </button>
                  </div>

                  <div className="rounded-[24px] glass-panel overflow-hidden">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-white/3 border-b border-white/5">
                          <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-1/4">Features</th>
                          {initialHeadphones.map((hp) => (
                            <th key={hp.id} className="p-4 text-xs font-bold w-[18%] text-white">
                              <span className="line-clamp-2 leading-tight">{hp.name}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs font-semibold text-slate-300">
                        <tr>
                          <td className="p-4 font-bold text-white">Noise Cancellation</td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★★</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Sound Quality</td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★★</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Battery Life</td>
                          <td className="p-4">30 hrs</td>
                          <td className="p-4">24 hrs</td>
                          <td className="p-4">60 hrs</td>
                          <td className="p-4">50 hrs</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Comfort</td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★★</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                          <td className="p-4"><div className="flex text-amber-500">★★★★☆</div></td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Weight</td>
                          <td className="p-4">250 g</td>
                          <td className="p-4">240 g</td>
                          <td className="p-4">293 g</td>
                          <td className="p-4">236 g</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Price</td>
                          <td className="p-4 text-cyan-300 font-bold">₹19,990</td>
                          <td className="p-4 text-cyan-300 font-bold">₹18,490</td>
                          <td className="p-4 text-cyan-300 font-bold">₹17,999</td>
                          <td className="p-4 text-cyan-300 font-bold">₹15,999</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* EXPLORE PAGE: AI Insights Grid */}
            {activeNav === 'explore' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto w-full pt-4 space-y-6"
              >
                <div className="leading-tight">
                  <h2 className="text-2xl font-extrabold font-serif">Rune AI Insights</h2>
                  <p className="text-xs text-[#707070] dark:text-slate-400 font-semibold mt-1">Our algorithmic highlights across standard shopping sectors</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                  {[
                    { type: "Best Value", name: "JBL Tour One M2", desc: "Top ANC headphones performance under budget threshold.", details: "₹15,999" },
                    { type: "Premium Choice", name: "Sony WH-1000XM5", desc: "Highest industry score in noise cancellation limits.", details: "₹19,990" },
                    { type: "Editor's Pick", name: "Organic Raw Honey", desc: "Cold pressed, raw honey rated highest in sensory audits.", details: "$14.99" },
                    { type: "Long Term Value", name: "Sennheiser Momentum 4", desc: "60-hour battery life extends cellular cycles drastically.", details: "₹17,999" },
                    { type: "Performance Winner", name: "Ethiopian Coffee Roasts", desc: "Single-origin Arabica rated highest by taste experts.", details: "$16.99" },
                    { type: "Best Battery", name: "Sennheiser Momentum 4", desc: "Reaches full recharge cycle within 2 hours.", details: "60 Hours" },
                    { type: "Best Camera", name: "iPhone 15 Pro", desc: "Top optics score across focal fields.", details: "₹1,24,900" },
                    { type: "Hidden Gem", name: "Organic Acacia Honey", desc: "Low glycemic index value at standard price levels.", details: "$17.99" }
                  ].map((insight, index) => (
                    <div 
                      key={index}
                      className="bg-white dark:bg-[#0A0A0A] rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] p-5 flex flex-col justify-between shadow-xs cursor-pointer hover:border-[#6C5CE7]/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EDE9FE] dark:bg-[#EDE9FE]/10 text-[#6C5CE7] dark:text-[#9E91FF] text-[10px] font-extrabold uppercase tracking-wider">
                          {insight.type}
                        </span>
                        <span className="text-xs font-bold text-[#111111] dark:text-white">{insight.details}</span>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-extrabold text-[#111111] dark:text-white">{insight.name}</h4>
                        <p className="text-xs text-[#707070] dark:text-slate-400 mt-1.5 leading-relaxed">{insight.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleSearchSubmit(`Tell me more details about the ${insight.name}`)}
                        className="mt-4 text-xs font-extrabold text-[#6C5CE7] dark:text-[#9E91FF] flex items-center gap-1"
                      >
                        <span>Analyze Details</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* COMPARE VIEW: Spec comparison workspace */}
            {activeNav === 'compare' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto w-full pt-4 space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-extrabold font-serif">Comparison Suite</h2>
                    <p className="text-xs text-[#707070] dark:text-slate-400 font-semibold mt-1">Side by side feature matching with winner highlights</p>
                  </div>
                  <button 
                    onClick={() => handleSearchSubmit(`Provide an overall comparison analysis for the products in my comparison suite`)}
                    className="rounded-full bg-[#6C5CE7] text-white text-xs font-bold px-4 py-2 hover:bg-[#5B4EBF]"
                  >
                    Generate AI Verdict
                  </button>
                </div>

                {/* Compare headers columns */}
                <div className="grid grid-cols-4 gap-4 bg-white dark:bg-[#0A0A0A] border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] p-6 shadow-xs">
                  <div className="flex flex-col justify-end text-xs font-bold text-[#707070] uppercase pb-2">
                    Specifications
                  </div>
                  {compareList.map((hp, idx) => (
                    <div 
                      key={hp.id} 
                      className={`rounded-2xl border p-4.5 flex flex-col gap-2.5 relative ${
                        idx === 0 ? 'border-[#6C5CE7] bg-[#EDE9FE]/5 dark:bg-[#EDE9FE]/2' : 'border-black/[0.06] dark:border-white/[0.08]'
                      }`}
                    >
                      {idx === 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#6C5CE7] to-[#8B5CF6] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          AI Winner
                        </span>
                      )}
                      <div className="p-2 rounded-xl bg-[#F7F6FB] dark:bg-[#151515] w-fit">
                        {renderHeadphoneIcon(hp.color)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#111111] dark:text-white line-clamp-1">{hp.name}</h4>
                        <span className="text-[11px] font-bold text-[#6C5CE7] dark:text-[#9E91FF] mt-1 block">₹{hp.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Spec table rows */}
                <div className="rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0A0A0A] overflow-hidden p-6 gap-4 flex flex-col shadow-xs">
                  {[
                    { feature: "Battery Capacity", specs: ["30 hrs", "24 hrs", "60 hrs"], winnerIdx: 2 },
                    { feature: "Noise Cancellation", specs: ["98% efficiency", "95% efficiency", "92% efficiency"], winnerIdx: 0 },
                    { feature: "Driver Diameter", specs: ["40 mm", "38 mm", "42 mm"], winnerIdx: 2 },
                    { feature: "Product Weight", specs: ["250 g", "240 g", "293 g"], winnerIdx: 1 },
                    { feature: "Warranty Coverage", specs: ["2 Years Limited", "1 Year Limited", "2 Years Limited"], winnerIdx: 0 }
                  ].map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-4 gap-4 text-xs font-semibold pb-3 border-b border-black/[0.03] dark:border-white/[0.03] last:border-0 last:pb-0">
                      <span className="font-extrabold text-[#111111] dark:text-white uppercase tracking-wide text-[10px]">{row.feature}</span>
                      {row.specs.map((spec, sIdx) => (
                        <div 
                          key={sIdx} 
                          className={`flex items-center gap-1.5 ${sIdx === row.winnerIdx ? 'text-[#22C55E] font-bold' : 'text-[#4A4A57] dark:text-slate-350'}`}
                        >
                          {sIdx === row.winnerIdx && <Check className="h-3.5 w-3.5" />}
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* WISHLIST SECTION: Folders, tags, collections */}
            {activeNav === 'wishlist' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto w-full pt-4 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-extrabold font-serif">Saved Collections</h2>
                    <p className="text-xs text-[#707070] dark:text-slate-400 font-semibold mt-1">Folders and priority tags for watched catalog items</p>
                  </div>
                  
                  {/* Create wishlist folder form */}
                  <form onSubmit={handleAddFolder} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="New folder..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0A0A0A] rounded-full px-3.5 py-1.5 text-xs text-[#111111] dark:text-white outline-none"
                    />
                    <button 
                      type="submit"
                      className="rounded-full bg-[#6C5CE7] hover:bg-[#5B4EBF] text-white p-2 flex items-center justify-center cursor-pointer"
                    >
                      <FolderPlus className="h-4.5 w-4.5" />
                    </button>
                  </form>
                </div>

                {/* Folder filter controls */}
                <div className="flex gap-2 border-b border-black/[0.04] dark:border-white/[0.06] pb-3 overflow-x-auto">
                  {['All', ...wishlistFolders].map((folder) => (
                    <button
                      key={folder}
                      onClick={() => setActiveWishlistFolder(folder)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        activeWishlistFolder === folder 
                          ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' 
                          : 'bg-white dark:bg-[#0A0A0A] border-black/[0.06] dark:border-white/[0.08] text-[#707070] hover:bg-slate-50'
                      }`}
                    >
                      {folder}
                    </button>
                  ))}
                </div>

                {/* Wishlist grid list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                  {wishlistItems
                    .filter(i => activeWishlistFolder === 'All' || i.folder === activeWishlistFolder)
                    .map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white dark:bg-[#0A0A0A] rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] p-5 flex flex-col justify-between shadow-xs relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-[#707070] font-bold uppercase">{item.folder}</span>
                            <h4 className="text-sm font-extrabold text-[#111111] dark:text-white mt-1.5">{item.name}</h4>
                            <p className="text-xs font-bold text-[#6C5CE7] dark:text-[#9E91FF] mt-1">
                              {item.price > 1000 ? `₹${item.price.toLocaleString()}` : `$${item.price.toFixed(2)}`}
                            </p>
                          </div>
                          
                          <button 
                            onClick={() => setWishlistItems(prev => prev.filter(i => i.id !== item.id))}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-black/[0.02] dark:border-white/[0.03] pt-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-[#22C55E] text-[8px] font-extrabold uppercase">
                            {item.tag}
                          </span>
                          <button 
                            onClick={() => handleSearchSubmit(`Search for the stored wishlist item: ${item.name}`)}
                            className="text-xs font-extrabold text-[#6C5CE7] dark:text-[#9E91FF] flex items-center gap-0.5"
                          >
                            <span>Analyze</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* DEALS SECTION */}
            {activeNav === 'deals' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto w-full pt-4 space-y-6"
              >
                <div className="leading-tight">
                  <h2 className="text-2xl font-extrabold font-serif">Active Price Alerts & Deals</h2>
                  <p className="text-xs text-[#707070] dark:text-slate-400 font-semibold mt-1">Top marked drops across matched collections</p>
                </div>

                <div className="bg-white dark:bg-[#0A0A0A] border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] p-6 shadow-xs flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="flex-1">
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 rounded-md text-[#22C55E] text-[9px] font-extrabold uppercase">Top Alert</span>
                    <h3 className="text-lg font-bold text-[#111111] dark:text-white mt-2">Sony WH-1000XM5 price dropped 12%</h3>
                    <p className="text-xs text-[#707070] dark:text-slate-400 mt-1">Currently listed at ₹19,990 (Historical low: ₹17,499)</p>
                  </div>
                  <button 
                    onClick={() => handleSearchSubmit("order number 1")}
                    className="rounded-full bg-[#6C5CE7] text-white px-5 py-3 text-xs font-bold hover:bg-[#5B4EBF] cursor-pointer"
                  >
                    Purchase Instantly
                  </button>
                </div>
              </motion.div>
            )}

            {/* HISTORY TAB */}
            {activeNav === 'history' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto w-full pt-4 space-y-6"
              >
                <div className="leading-tight">
                  <h2 className="text-2xl font-extrabold font-serif">Purchase & Search History</h2>
                  <p className="text-xs text-[#707070] dark:text-slate-400 font-semibold mt-1">Your previous AI conversational routes and purchases</p>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { title: "Best noise cancelling headphones under ₹20,000", date: "June 20, 2026", type: "Search Inquiry" },
                    { title: "Sony WH-1000XM5 bought for ₹19,990", date: "June 19, 2026", type: "Fulfill Order" },
                    { title: "Organic Manuka Honey price analysis", date: "June 15, 2026", type: "Pricing Scan" }
                  ].map((hist, idx) => (
                    <div 
                      key={idx}
                      className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-4 flex items-center justify-between shadow-xs hover:border-[#6C5CE7]/20 cursor-pointer"
                      onClick={() => handleSearchSubmit(hist.title)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#F8F8FA] dark:bg-[#121212]">
                          <History className="h-4.5 w-4.5 text-[#6C5CE7]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#111111] dark:text-white">{hist.title}</h4>
                          <span className="text-[10px] text-[#707070] font-bold mt-1 block">{hist.date}</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-black/[0.02] dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.08] rounded-md px-2 py-0.5 text-[#707070] font-extrabold uppercase">
                        {hist.type}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SETTINGS AND PROFILE MOCKS */}
            {(activeNav === 'settings' || activeNav === 'profile') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto w-full pt-4 space-y-6"
              >
                <h2 className="text-2xl font-extrabold font-serif uppercase tracking-tight">Rune System Setup</h2>
                <div className="bg-white dark:bg-[#0A0A0A] border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] p-6 text-xs text-[#707070] space-y-4">
                  <p>All system endpoints are configured correctly under target API paths.</p>
                  <div>
                    <span className="font-extrabold block text-black dark:text-white">API URL:</span>
                    <span className="font-mono">{BACKEND_URL}</span>
                  </div>
                  <div>
                    <span className="font-extrabold block text-black dark:text-white">Active Database Schema:</span>
                    <span className="font-mono">SQLite (store.db)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHAT SESSION SCREEN */}
            {activeNav === 'chat' && (
              <div className="flex-1 flex flex-col rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0A0A0A]/50 backdrop-blur-md overflow-hidden min-h-0 shadow-xs">
                
                {/* Active Chat Header */}
                <div className="h-14 border-b border-black/[0.06] dark:border-white/[0.08] px-6 flex items-center justify-between bg-white/40 dark:bg-black/20">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${apiConnected ? 'bg-[#22C55E] animate-pulse' : 'bg-rose-500'}`} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#707070]">
                      {apiConnected ? 'Rune Session Live' : 'Server Off'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={startNewChat}
                    className="text-xs font-bold text-[#6C5CE7] dark:text-[#9E91FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>New Session</span>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Chat Dialog Scroll Area */}
                <ChatArea 
                  messages={messages} 
                  isSearching={isSearching} 
                  onOrder={handleOrder} 
                  backendUrl={BACKEND_URL}
                />

                {/* Bottom Input Area */}
                <div className="p-5 border-t border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E0E0F]/80">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}
                    className="relative flex items-center max-w-3xl mx-auto"
                  >
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Find, compare, or buy items instantly..."
                      disabled={isSearching}
                      className="w-full rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-[#F8F8FA] dark:bg-[#121212] px-5 py-4.5 pr-24 text-sm text-[#111111] dark:text-white placeholder-[#707070] outline-none focus:ring-1 focus:ring-[#6C5CE7] focus:border-[#6C5CE7] disabled:opacity-50"
                    />

                    {/* Camera upload */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSearching}
                      className="absolute right-14 p-2 rounded-full hover:bg-black/[0.03] dark:hover:bg-white/5 text-[#707070] transition-all disabled:opacity-50 cursor-pointer"
                      title="Upload image"
                    >
                      {uploading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Camera className="h-4.5 w-4.5" />}
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isSearching}
                      className="absolute right-2 p-2.5 rounded-full bg-[#6C5CE7] dark:bg-[#8B5CF6] text-white hover:bg-[#5B4EBF] transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-350 cursor-pointer"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </form>

                  {uploadedImage && (
                    <div className="max-w-3xl mx-auto mt-2 flex items-center justify-between border border-[#6C5CE7]/20 bg-[#EDE9FE]/20 dark:bg-[#EDE9FE]/5 rounded-xl px-3 py-1.5 text-xs text-[#6C5CE7] dark:text-[#9E91FF] animate-slide-up">
                      <div className="flex items-center gap-2 truncate">
                        <Camera className="h-3.5 w-3.5" />
                        <span className="font-bold truncate">{uploadedImage.filename}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleImageSearch(uploadedImage)}
                          className="font-bold underline text-[#6C5CE7] hover:text-[#5B4EBF]"
                        >
                          Find Similar Products
                        </button>
                        <button onClick={() => setUploadedImage(null)}>
                          <X className="h-3.5 w-3.5 text-rose-500 hover:scale-105 transition-all" />
                        </button>
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="max-w-3xl mx-auto mt-2 text-rose-500 font-medium text-[11px]">
                      {uploadError}
                    </div>
                  )}

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <div className="mt-2.5 text-center text-[10px] text-[#707070] font-semibold">
                    Simulated secure sandbox processing. Real operations executed via FastAPI & SQLite store.db.
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN INSIGHTS/DETAILS (Gravity Core Cosmic Vortex) */}
          {activeNav === 'home' && (
            <aside className="hidden xl:flex w-[28%] border-l border-white/5 p-6 flex-col gap-6 overflow-y-auto shrink-0 bg-black/25 backdrop-blur-md relative z-10">
              <GravityCore />
            </aside>
          )}

        </div>

      </div>

    </div>
  );
}
