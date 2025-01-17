import { useState, useEffect, useRef } from 'react';
    import { FaPaperPlane, FaRobot } from 'react-icons/fa';

    export default function DocumentChat({ documentId }) {
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const chatEndRef = useRef(null);

      useEffect(() => {
        if (documentId) {
          // Load chat history for document
          const savedChat = JSON.parse(localStorage.getItem(`chat-${documentId}`) || '[]');
          setMessages(savedChat);
        }
      }, [documentId]);

      useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

      const handleSendMessage = async () => {
        if (input.trim()) {
          const userMessage = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date().toISOString()
          };

          // Add user message
          const updatedMessages = [...messages, userMessage];
          setMessages(updatedMessages);
          setInput('');
          localStorage.setItem(`chat-${documentId}`, JSON.stringify(updatedMessages));

          // Get AI response
          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                documentId,
                message: input
              })
            });

            if (response.ok) {
              const data = await response.json();
              const aiMessage = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'ai',
                timestamp: new Date().toISOString()
              };
              setMessages([...updatedMessages, aiMessage]);
              localStorage.setItem(`chat-${documentId}`, JSON.stringify([...updatedMessages, aiMessage]));
            }
          } catch (error) {
            console.error('Chat error:', error);
          }
        }
      };

      return (
        <div className="document-chat">
          <div className="chat-header">
            <h3>Document Chat</h3>
            <div className="ai-indicator">
              <FaRobot /> AI Assistant
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender}`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about the document..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      );
    }
