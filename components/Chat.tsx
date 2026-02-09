'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect, useState } from 'react';

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'raindrop_user_id';
  let userId = localStorage.getItem(key);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(key, userId);
  }
  return userId;
}

function generateConvoId(): string {
  return crypto.randomUUID();
}

export default function Chat() {
  const [userId, setUserId] = useState<string>('');
  const [convoId, setConvoId] = useState<string>('');

  useEffect(() => {
    setUserId(getOrCreateUserId());
    setConvoId(generateConvoId());
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { userId, convoId },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="container">
      <h1>Vercel AI SDK Chat</h1>
      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-label">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-label">Assistant</div>
              <div className="message-content">
                <div className="loading"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            autoComplete="off"
            disabled={isLoading}
            id="messageInput"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            id="sendButton"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
