import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import CalendarModal from '../../components/Modals/Calendar/index.tsx';
import TitleBar from '../../components/TitleBar/index.tsx';
import CreateGroupModal from '../../components/Modals/Groups/CreateGroupModal.tsx';
import { ScreenShotIcon } from '../../assets/icons.tsx';
import SideNav from '../../components/SideNav/index.tsx';

// --- TYPES ---
interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  type: 'text' | 'file';
  timestamp: string;
}

interface User {
  ip: string;
  name: string;
  online: boolean;
}

interface MainContent {
  isCalendarOpen: boolean;
  setCalendarOpen: (value: boolean) => void;
}

function MainContent({isCalendarOpen, setCalendarOpen} : MainContent) {
    // --- STATE ---
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [myIP, setMyIP] = useState<string>('Detecting...');
  const [isCreateGroupOpen, setCreateGroupOpen] = useState(false); // Create Group Modal State

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // MOCK DATA: Simulating DiscoveryService
  const [users, setUsers] = useState<User[]>([
    { ip: '192.168.1.5', name: 'USER A (Laptop EVM)', online: true },
    { ip: '192.168.1.8', name: 'USER B (Desktop EVM)', online: false },
    { ip: '192.168.1.12', name: 'USER C (Server PC EVM)', online: true },
  ]);

  // MOCK DATA: Chat History
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'System Online. Secure Channel Active.', sender: 'them', type: 'text', timestamp: '09:59 AM' },
    { id: 2, text: 'Awaiting data package.', sender: 'them', type: 'text', timestamp: '10:00 AM' },
  ]);

  // --- EFFECTS ---
  // 1. Fetch Local IP on startup
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const ip = await window.electronAPI.getLocalIP();
        setMyIP(ip);
      } catch (e) {
        setMyIP('Unknown');
      }
    };
    fetchIP();
  }, []);

  // 2. Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- HANDLERS ---

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const newMsg: Message = {
        id: Date.now(),
        text: `Sending file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        sender: 'me',
        type: 'file',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  // Chat
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleCaptureScreen = () => {
    window.electronAPI.openDialog('snipper');
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- RENDER ---
  return (
    <div className="main-content">
      {/* TACTICAL CALENDAR MODAL */}
      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setCalendarOpen(false)} 
        users={users} 
      />

      <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => setCreateGroupOpen(false)} 
        users={users} 
      />

      <div className="content-area">
        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div>
              <h3>Local Network</h3>
              <span className="badge">{users.filter(u => u.online).length} Active</span>
            </div>     

            <button
              onClick = {() => setCreateGroupOpen(true)}
              className = "attach-btn"
              style={{ width: '32px', height: '32px', border: 'none' }} 
                title="Create Group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                   <circle cx="9" cy="7" r="4"></circle>
                   <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                   <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </button>

          </div>

          <div className="user-list">
            {users.map((user) => (
              <div
                key={user.ip}
                className={`user-item ${activeUser?.ip === user.ip ? 'active' : ''}`}
                onClick={async () => {
                  setActiveUser(user)
                }}
              >
                <div className={`status-dot ${user.online ? 'online' : 'offline'}`}></div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-ip mono-text">{user.ip}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="my-status">
              <div className="status-dot online blink"></div>
              <div className="status-details">
                <span className="label">HOST IP</span>
                <span className="mono-text">{myIP}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CHAT WINDOW */}
        <main
          className="chat-window"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* DRAG OVERLAY */}
          {isDragging && (
            <div className="drag-overlay">
              <div style={{ fontSize: '3rem' }}>📂</div>
              <div className="drag-text">DROP FILE TO SEND</div>
              <div className="mono-text">Secure P2P Transfer</div>
            </div>
          )}

          {activeUser ? (
            <>
              <header className="chat-header">
                <div className="chat-header-info">
                  <h2>{activeUser.name}</h2>
                  <span className="status-text mono-text">
                    {activeUser.online ? '• SECURE CONNECTION' : '• OFFLINE'}
                  </span>
                </div>
              </header>

              <div className="messages-area">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-row ${msg.sender}`}>
                    <div className="message-bubble">
                      {msg.type === 'file' ? '📎 ' : ''}
                      {msg.text}
                      <span className="timestamp">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                {/* CALENDAR BUTTON */}
                <button 
                    className="attach-btn" 
                    onClick={() => setCalendarOpen(true)} 
                    title="Open Calendar"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </button>

                {/* ATTACH BUTTON */}
                <button className="attach-btn" title="Send File">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                
                {/* SEND BUTTON */}
                <button className="send-btn" onClick={handleSendMessage}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
                <button className="attach-btn" onClick={handleCaptureScreen}>
                  <ScreenShotIcon stroke={"currentcolor"} width={30} height={30}/>
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h1 className="glitch-text">BSTC MESSENGER</h1>
              <p className="mono-text">Select a node to establish connection.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Home() {
  const [isCalendarOpen, setCalendarOpen] = useState(false); // Calendar State

  return (
    <>
      <TitleBar controls={{ minimize: true, maximize: true, close: true }} />
      <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1}}>
        <SideNav handleUserSettings={() => setCalendarOpen(true)}/>
        <MainContent isCalendarOpen={isCalendarOpen} setCalendarOpen={setCalendarOpen}/>
      </div>
    </>
  );
}

export default Home;