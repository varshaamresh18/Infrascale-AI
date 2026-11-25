import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { ChatMessageItem } from '../../types/estimator';
import { ChatMessage } from './ChatMessage';
import { QuickReplies } from './QuickReplies';

interface ArchitectChatProps {
  messages: ChatMessageItem[];
  quickReplies: string[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  onSelectQuickReply: (text: string) => void;
  onNewSession: () => void;
  threadId: string;
}

export const ArchitectChat: React.FC<ArchitectChatProps> = ({
  messages,
  quickReplies,
  isThinking,
  onSendMessage,
  onSelectQuickReply,
  onNewSession,
  threadId,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="rounded-xl border border-border bg-card-elevated flex flex-col h-[340px] overflow-hidden shadow-card-glow">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-[#090D16]/70">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald shadow-emerald-glow" />
          <h3 className="text-xs font-semibold text-text-primary">
            Consultative AI Architect
          </h3>
          <span className="text-[10px] font-mono text-text-muted hidden sm:inline">
            • Session: {threadId.slice(0, 8)}...
          </span>
        </div>

        <button
          onClick={onNewSession}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono text-text-secondary hover:text-text-primary hover:bg-card border border-border transition-colors"
          title="Reset conversation state"
        >
          <RotateCcw className="w-3 h-3" />
          <span>New Session</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isThinking && (
          <ChatMessage
            message={{
              id: 'thinking',
              sender: 'assistant',
              content: '',
              timestamp: 'Now',
              isThinking: true,
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Footer */}
      {quickReplies.length > 0 && !isThinking && (
        <div className="px-4 py-2 border-t border-border/40 bg-[#090D16]/40">
          <QuickReplies
            replies={quickReplies}
            onSelect={onSelectQuickReply}
            disabled={isThinking}
          />
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border bg-[#090D16]/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe your AI workload (e.g., 'We process 200k support tickets with 1500ms SLA')..."
          disabled={isThinking}
          className="flex-1 bg-card border border-border/80 focus:border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary font-sans"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="p-2 rounded-lg bg-primary hover:bg-primary-hover text-background font-medium shadow-cyan-glow transition-all disabled:opacity-40 disabled:hover:bg-primary active:scale-95 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
