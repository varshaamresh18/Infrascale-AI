import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  replies,
  onSelect,
  disabled = false,
}) => {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      <span className="text-[10px] text-text-muted font-mono flex items-center gap-1 mr-1">
        <Sparkles className="w-3 h-3 text-primary" />
        HITL Quick Replies:
      </span>
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="px-2.5 py-1 rounded-full text-xs font-mono bg-card-elevated hover:bg-card-hover border border-primary/30 hover:border-primary text-primary-light transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};
