import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Sliders, Info, Check, X, AlertCircle } from 'lucide-react';

export default function ProductCard({ product, onOrder, onCompare, onSave }) {
  const { number, name, id, price, rating, isOrganic } = product;
  const [saved, setSaved] = useState(false);

  // Determine category and icon emoji based on the name keywords
  const getProductEmoji = (name) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('honey')) return '🍯';
    if (lowercaseName.includes('oil')) return '🧴';
    if (lowercaseName.includes('almond') || lowercaseName.includes('nuts') || lowercaseName.includes('cashew')) return '🥜';
    if (lowercaseName.includes('tea') || lowercaseName.includes('chamomile')) return '🍵';
    if (lowercaseName.includes('coffee') || lowercaseName.includes('espresso')) return '☕';
    if (lowercaseName.includes('oats') || lowercaseName.includes('quinoa') || lowercaseName.includes('rice') || lowercaseName.includes('granola')) return '🥣';
    if (lowercaseName.includes('mango') || lowercaseName.includes('dried') || lowercaseName.includes('trail')) return '🥭';
    if (lowercaseName.includes('milk') || lowercaseName.includes('dairy')) return '🥛';
    if (lowercaseName.includes('headphone') || lowercaseName.includes('sony') || lowercaseName.includes('bose') || lowercaseName.includes('sennheiser') || lowercaseName.includes('jbl')) return '🎧';
    if (lowercaseName.includes('laptop') || lowercaseName.includes('macbook')) return '💻';
    if (lowercaseName.includes('keyboard')) return '⌨️';
    if (lowercaseName.includes('phone') || lowercaseName.includes('iphone') || lowercaseName.includes('samsung')) return '📱';
    if (lowercaseName.includes('shoe') || lowercaseName.includes('nike') || lowercaseName.includes('run')) return '👟';
    return '🛒';
  };

  const emoji = getProductEmoji(name);

  // Dynamic tags mapping to mimic premium mock tags for real database products
  const getProductTag = () => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('sony') || lowercaseName.includes('macbook')) 
      return { text: 'Best Overall', bg: 'bg-[#EDE9FE] dark:bg-[#EDE9FE]/10', color: 'text-[#6C5CE7] dark:text-[#9E91FF]' };
    if (lowercaseName.includes('bose') || lowercaseName.includes('keyboard')) 
      return { text: 'Best Comfort', bg: 'bg-[#FFE4D1] dark:bg-[#FFE4D1]/10', color: 'text-[#C2410C] dark:text-[#FFB38A]' };
    if (lowercaseName.includes('sennheiser') || lowercaseName.includes('iphone') || lowercaseName.includes('phone')) 
      return { text: 'Best Sound', bg: 'bg-[#D1FAE5] dark:bg-[#D1FAE5]/10', color: 'text-[#047857] dark:text-[#6EE7B7]' };
    if (lowercaseName.includes('jbl') || lowercaseName.includes('shoe')) 
      return { text: 'Best Value', bg: 'bg-[#DBEAFE] dark:bg-[#DBEAFE]/10', color: 'text-[#1D4ED8] dark:text-[#93C5FD]' };

    // Fallbacks for real database products
    if (isOrganic) {
      if (price > 18) return { text: 'Best Quality', bg: 'bg-[#D1FAE5] dark:bg-[#D1FAE5]/10', color: 'text-[#047857] dark:text-[#6EE7B7]' };
      return { text: 'Editor\'s Pick', bg: 'bg-[#EDE9FE] dark:bg-[#EDE9FE]/10', color: 'text-[#6C5CE7] dark:text-[#9E91FF]' };
    } else {
      if (price < 10) return { text: 'Best Value', bg: 'bg-[#DBEAFE] dark:bg-[#DBEAFE]/10', color: 'text-[#1D4ED8] dark:text-[#93C5FD]' };
      return { text: 'Standard Choice', bg: 'bg-gray-100 dark:bg-white/5', color: 'text-gray-650 dark:text-gray-300' };
    }
  };

  const tag = getProductTag();

  // Generate dynamic pros/cons/scores based on the product traits
  const getProductInsights = () => {
    const lowercaseName = name.toLowerCase();
    
    // Headphones
    if (lowercaseName.includes('sony')) {
      return {
        pros: ["Industry-leading ANC", "30-hour battery life", "Premium sound signature"],
        cons: ["Premium price point", "Touch controls can be sensitive"],
        bestFor: "Work and long-distance travel",
        aiScore: 98,
        confidence: 96
      };
    }
    if (lowercaseName.includes('bose')) {
      return {
        pros: ["Unmatched wearing comfort", "Very lightweight", "Great spatial audio"],
        cons: ["Average battery life (24h)", "No EQ custom profiles"],
        bestFor: "All-day desk wear & calling",
        aiScore: 94,
        confidence: 93
      };
    }
    if (lowercaseName.includes('sennheiser')) {
      return {
        pros: ["Superb audiophile sound", "Incredible 60-hour battery", "Premium fabric finish"],
        cons: ["Bulkier carrying case", "ANC is slightly weaker than Sony"],
        bestFor: "Music enthusiasts & audiophiles",
        aiScore: 95,
        confidence: 91
      };
    }
    if (lowercaseName.includes('jbl')) {
      return {
        pros: ["Exceptional price-to-performance", "Solid active noise cancellation", "Very lightweight design"],
        cons: ["Plastic build quality", "Soundstage feels narrow"],
        bestFor: "Budget-conscious buyers",
        aiScore: 91,
        confidence: 94
      };
    }

    // Honey
    if (lowercaseName.includes('honey')) {
      return {
        pros: ["100% raw and unfiltered", "Rich organic antioxidants", "Sourced from eco-beekeepers"],
        cons: ["Intense sweetness", "Glass jar requires careful shipping"],
        bestFor: "Teas, baking, and direct wellness usage",
        aiScore: isOrganic ? 96 : 89,
        confidence: isOrganic ? 95 : 88
      };
    }

    // Oil
    if (lowercaseName.includes('oil')) {
      return {
        pros: ["Cold-pressed extraction method", "Certified organic status", "Rich in healthy monounsaturated fats"],
        cons: ["Slightly bitter peppery finish", "Requires dark cool storage"],
        bestFor: "Salad dressings and light sautéing",
        aiScore: isOrganic ? 97 : 88,
        confidence: isOrganic ? 94 : 89
      };
    }

    // Default general product insights
    return {
      pros: ["High quality sourcing", "Excellent customer satisfaction reviews", "Premium grade ingredients"],
      cons: ["Limited seasonal supply"],
      bestFor: "Daily healthy lifestyle consumption",
      aiScore: isOrganic ? 93 : 86,
      confidence: isOrganic ? 92 : 87
    };
  };

  const insights = getProductInsights();

  const handleSaveToggle = () => {
    setSaved(!saved);
    if (onSave) onSave(product);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-visible rounded-[24px] glass-panel glass-panel-hover p-5 select-none">
      
      {/* Decorative corner glows */}
      <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-[24px] bg-gradient-to-bl from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-[24px] bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* AI Score & Confidence Overlay Banner */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-t-[24px]" />
      
      <div>
        {/* Header: Item Index, Rating, & Score Info */}
        <div className="relative rounded-2xl bg-white/3 border border-white/5 h-32 flex items-center justify-center text-5xl mb-4 overflow-visible">
          
          {/* Glowing back projection ring */}
          <div className="absolute w-16 h-16 rounded-full bg-cyan-400/5 blur-xl group-hover:bg-cyan-400/15 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

          {/* Badge top-left */}
          {number && (
            <span className="absolute top-3 left-3 flex h-6 px-2.5 items-center justify-center rounded-full bg-cyan-500/25 border border-cyan-400/30 text-[11px] font-bold text-cyan-300 shadow-sm shadow-cyan-400/10">
              #{number}
            </span>
          )}
          
          {/* Rating top-right */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-[#22C55E] shadow-xs border border-white/5">
            <span className="text-amber-500">★</span> {rating ? rating.toFixed(1) : '4.5'}
          </div>
 
          {/* Floating Product Icon suspended in zero-gravity */}
          <span className="transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-7 group-hover:rotate-12 filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_15px_20px_rgba(0,242,254,0.45)] animate-float-slow">
            {emoji}
          </span>
        </div>
 
        {/* Name, Category tag, & Price */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors duration-250">
              {name}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">ID: {id}</p>
          </div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold shrink-0 ${tag.bg} ${tag.color}`}>
            {tag.text}
          </span>
        </div>
 
        {/* AI Score & Confidence Details */}
        <div className="mt-3 grid grid-cols-2 gap-3 bg-white/2 rounded-xl p-2.5 border border-white/5">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-wider">AI Score</span>
            <p className="text-sm font-black text-cyan-400 text-glow-cyan">{insights.aiScore}/100</p>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-extrabold tracking-wider">Confidence</span>
            <p className="text-sm font-black text-white">{insights.confidence}%</p>
          </div>
        </div>

        {/* Best For Specification */}
        <div className="mt-3.5 text-xs">
          <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">Best For</span>
          <span className="font-bold text-slate-200">{insights.bestFor}</span>
        </div>

        {/* Pros & Cons Section */}
        <div className="mt-3.5 space-y-2 border-t border-white/5 pt-3.5">
          {/* Pros */}
          <div className="space-y-1">
            <span className="text-[#22C55E] font-bold text-[9px] uppercase tracking-wider block">Pros</span>
            {insights.pros.map((pro, index) => (
              <div key={index} className="flex items-start gap-1 text-[11px] text-slate-300 font-medium">
                <Check className="h-3 w-3 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{pro}</span>
              </div>
            ))}
          </div>

          {/* Cons */}
          <div className="space-y-1 pt-1.5">
            <span className="text-rose-500 font-bold text-[9px] uppercase tracking-wider block">Cons</span>
            {insights.cons.map((con, index) => (
              <div key={index} className="flex items-start gap-1 text-[11px] text-slate-300 font-medium">
                <X className="h-3 w-3 text-rose-500 shrink-0 mt-0.5" />
                <span>{con}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer: Price & Order Action */}
      <div className="mt-5 border-t border-white/5 pt-3.5">
        
        {/* Price & Primary Purchase */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Price</p>
            <p className="text-base font-bold text-white">
              {price ? (price > 1000 ? `₹${price.toLocaleString()}` : `$${price.toFixed(2)}`) : '₹19,990'}
            </p>
          </div>

          <button
            onClick={() => onOrder(number, id)}
            className="flex items-center gap-1.5 rounded-full bg-cyan-500/25 border border-cyan-400/40 hover:bg-cyan-500/40 px-4.5 py-2 text-xs font-bold text-cyan-300 transition-all shadow-sm shadow-cyan-400/10 cursor-pointer active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Buy Now
          </button>
        </div>

        {/* Auxiliary Controls: Compare, Save, Explain */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-2.5 text-[10px]">
          <button
            onClick={() => onCompare && onCompare(product)}
            className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/8 text-slate-300 font-bold transition-all cursor-pointer"
          >
            <Sliders className="h-3 w-3 text-cyan-400" />
            Compare
          </button>

          <button
            onClick={handleSaveToggle}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              saved 
                ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400' 
                : 'bg-white/3 border border-white/5 hover:bg-white/8 text-slate-300'
            }`}
          >
            <Heart className={`h-3 w-3 ${saved ? 'fill-rose-400 text-rose-400' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={() => onOrder && onOrder(number, id)} // Maps to explaining/processing
            className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/8 text-slate-300 font-bold transition-all cursor-pointer"
          >
            <Info className="h-3 w-3 text-purple-400" />
            Explain
          </button>
        </div>

      </div>
    </div>
  );
}
