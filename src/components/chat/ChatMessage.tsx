import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { ChatMessageItem } from '../../types/estimator';

interface ChatMessageProps {
  message: ChatMessageItem;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <div
      className={`flex gap-3 text-xs ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 text-primary shrink-0 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-3 shadow-sm ${
          isAssistant
            ? 'bg-card-elevated border border-border text-text-primary'
            : 'bg-primary text-background font-medium'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-1">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              isAssistant ? 'text-primary' : 'text-background/80'
            }`}
          >
            {isAssistant ? 'InfraScale Architect' : 'You'}
          </span>
          <span
            className={`text-[9px] font-mono ${
              isAssistant ? 'text-text-muted' : 'text-background/70'
            }`}
          >
            {message.timestamp}
          </span>
        </div>

        {message.isThinking ? (
          <div className="flex items-center gap-1.5 py-1 text-primary-light">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="font-mono text-[11px] animate-pulse">
              Architect evaluating workload requirements...
            </span>
          </div>
        ) : (
          <p className="whitespace-pre-line leading-relaxed text-xs">
            {message.content}
          </p>
        )}
      </div>

      {!isAssistant && (
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-card-elevated border border-border text-text-secondary shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
