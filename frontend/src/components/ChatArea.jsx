import React, { useEffect, useRef } from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { parseAgentMessage } from '../utils/parser';
import ProductCard from './ProductCard';
import OrderReceipt from './OrderReceipt';

export default function ChatArea({ messages, isSearching, onOrder, backendUrl }) {
  const bottomRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearching]);

  // Simple text formatting helper to handle basic Markdown tags
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    // Split into paragraphs by double newlines
    const paragraphs = text.split(/\n\n+/);

    return paragraphs.map((para, paraIdx) => {
      // Process bold syntax (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      const parts = [];
      let lastIndex = 0;
      let match;
      
      // Reset regex index
      boldRegex.lastIndex = 0;
      
      while ((match = boldRegex.exec(para)) !== null) {
        // Add preceding text
        if (match.index > lastIndex) {
          parts.push(para.substring(lastIndex, match.index));
        }
        // Add bolded text
        parts.push(<strong key={match.index} className="font-bold text-[#1E1F30]">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < para.length) {
        parts.push(para.substring(lastIndex));
      }

      // Check if this paragraph is a list item
      if (para.trim().startsWith('- ') || para.trim().startsWith('* ')) {
        const listItems = para.split(/\n[-*]\s+/);
        return (
          <ul key={paraIdx} className="list-disc pl-5 mt-2 mb-2 text-[#4A4A57] space-y-1 text-sm">
            {listItems.map((item, idx) => (
              <li key={idx}>{item.replace(/^[-*]\s+/, '')}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={paraIdx} className="text-[#4A4A57] leading-relaxed text-sm mb-3 last:mb-0">
          {parts.length > 0 ? parts : para}
        </p>
      );
    });
  };

  // Custom User Image Message renderer
  const renderUserImageMessage = (msg) => {
    try {
      const match = msg.content.match(/Image path:\s*(.*)$/);
      const fullPath = match ? match[1].trim() : '';
      const filename = fullPath.split(/[/\\]/).pop() || 'image.jpg';
      
      // Look for relative static url if we saved it in our local messages object
      const localUrl = msg.imageUrl ? `${backendUrl}${msg.imageUrl}` : null;

      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#6D5FD8] font-bold text-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Searching by image: {filename}</span>
          </div>
          {localUrl && (
            <div className="mt-1.5 rounded-2xl overflow-hidden border border-[#EFEFF2] max-w-[200px] bg-[#F7F6FB] p-1">
              <img src={localUrl} alt="Uploaded query" className="max-h-36 object-contain rounded-xl" />
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <span>Searching by image...</span>;
    }
  };

  // Helper to render AI response parsed content
  const renderAssistantContent = (msg) => {
    const parsed = parseAgentMessage(msg.content);

    if (parsed.type === 'products') {
      const { products, beforeText, afterText } = parsed.content;
      return (
        <div className="flex flex-col gap-4">
          {beforeText && <div className="text-[#4A4A57]">{renderFormattedText(beforeText)}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 mb-2">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOrder={onOrder} 
              />
            ))}
          </div>
          
          {afterText && <div className="text-[#4A4A57]">{renderFormattedText(afterText)}</div>}
        </div>
      );
    }

    if (parsed.type === 'receipt') {
      const { beforeText, afterText } = parsed.content;
      return (
        <div className="flex flex-col gap-4">
          {beforeText && <div className="text-[#4A4A57]">{renderFormattedText(beforeText)}</div>}
          <div className="my-2 max-w-md">
            <OrderReceipt receipt={parsed.content} />
          </div>
          {afterText && <div className="text-[#4A4A57]">{renderFormattedText(afterText)}</div>}
        </div>
      );
    }

    return renderFormattedText(msg.content);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-transparent">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
          {/* Welcome Screen handled inside Dashboard view */}
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isImageSearch = isUser && msg.content.startsWith('I uploaded a product image');

            return (
              <div 
                key={index} 
                className={`flex gap-4 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'} animate-slide-up`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 h-9 w-9 rounded-full border flex items-center justify-center shadow-xs ${
                  isUser 
                    ? 'bg-[#6D5FD8] border-[#6D5FD8] text-white' 
                    : 'bg-white border-[#EFEFF2] text-[#6D5FD8]'
                }`}>
                  {isUser ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-[22px] px-5 py-4 text-sm shadow-xs border ${
                  isUser 
                    ? 'bg-[#EDE9FE]/80 border-[#6D5FD8]/10 text-[#1E1F30]' 
                    : 'bg-white border-[#EFEFF2] text-[#1E1F30]'
                }`}>
                  {isImageSearch 
                    ? renderUserImageMessage(msg) 
                    : isUser 
                      ? renderFormattedText(msg.content)
                      : renderAssistantContent(msg)
                  }
                </div>
              </div>
            );
          })}

          {/* Assistant Thinking / Loader */}
          {isSearching && (
            <div className="flex gap-4 max-w-3xl mr-auto animate-pulse">
              <div className="flex-shrink-0 h-9 w-9 rounded-full border bg-white border-[#EFEFF2] flex items-center justify-center text-[#6D5FD8]">
                <Bot className="h-4.5 w-4.5 animate-spin" />
              </div>
              <div className="rounded-[22px] px-5 py-3.5 bg-white border border-[#EFEFF2] text-[#8A8A99] flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-[#6D5FD8] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#6D5FD8]/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#6D5FD8]/50 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs font-semibold">Rune AI is formulating recommendations...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
