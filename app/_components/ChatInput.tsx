'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = '24px';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Corresponds to maxHeight in style
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  return (
    <>
      {/* Fixed Input Container */}
      <div
        className="position-fixed bottom-0 start-0 end-0"
        style={{
          zIndex: 1010,
          background: 'linear-gradient(to top, rgba(250, 250, 250, 1) 70%, rgba(250, 250, 250, 0))',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        <div className="container-fluid" style={{ maxWidth: '800px' }}>
          <div className="px-3 pb-3 pt-2">
            {/* Quick Actions */}
            <div className="d-flex gap-2 mb-2 overflow-auto pb-1">
              {!input && !isLoading && (
                <>
                  <button
                    className="btn btn-sm rounded-pill flex-shrink-0 border bg-light text-secondary"
                    onClick={() => setInput("Create a futuristic cityscape at sunset")}
                  >
                    🎨 Generate Image
                  </button>
                  <button
                    className="btn btn-sm rounded-pill flex-shrink-0 border bg-light text-secondary"
                    onClick={() => setInput("Explain quantum computing in simple terms")}
                  >
                    🧠 Explain Topics
                  </button>
                  <button
                    className="btn btn-sm rounded-pill flex-shrink-0 border bg-light text-secondary"
                    onClick={() => setInput("Help me write a professional email")}
                  >
                    📧 Email Help
                  </button>
                  <button
                    className="btn btn-sm rounded-pill flex-shrink-0 border bg-light text-secondary"
                    onClick={() => setInput("Tell me a funny joke")}
                  >
                    😄 Tell a Joke
                  </button>
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit}>
              <div
                className="d-flex align-items-end gap-2 p-2 bg-white rounded-4"
                style={{
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                }}
              >
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  className="form-control border-0 shadow-none bg-transparent"
                  placeholder="Message Apex AI..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  rows={1}
                  style={{
                    minHeight: '24px',
                    maxHeight: '120px',
                    resize: 'none',
                    lineHeight: '1.5',
                  }}
                />

                {/* Send Button */}
                <button
                  className="btn border-0 p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '0.65rem',
                    backgroundColor: input.trim() && !isLoading ? '#000000' : '#e5e7eb',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm text-secondary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M7 11L12 6L17 11M12 18V6"
                        stroke={input.trim() ? "white" : "#9ca3af"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Text */}
            <div className="text-center mt-2">
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                Apex AI can make mistakes. Consider checking important information.
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
















