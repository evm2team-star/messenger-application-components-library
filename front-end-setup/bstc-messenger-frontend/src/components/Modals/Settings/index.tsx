import React, { useState } from 'react';
import './styles.css';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: { ip: string; name: string; online: boolean }[];
}

interface Event {
  id: number;
  date: string;
  title: string;
  type: 'meeting' | 'todo'; // New Type
  participants?: string[];
  isCompleted?: boolean; // For To-Do items
}

const SettingsModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, users }) => {

  if (!isOpen) return null;

  const handlePrevMonth = () => {
  };

  const handleNextMonth = () => {
  };

  const handleAddEvent = () => {
    
  };

  const toggleParticipant = (ip: string) => {
    
  };

  // Toggle To-Do Checkbox
  const toggleTodoComplete = (eventId: number) => {
  };


  return (
    <div className="modal-overlay">
      <div className="calendar-container glass-panel">
        {/* HEADER */}
        <div className="cal-header">
          <div style={{flex: '3', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '10px'}}>
            <button onClick={handlePrevMonth} className="cal-nav-btn">&lt;</button>
            <div className="cal-title">
              <h2>monthNames[date.getMonth()]</h2>
              <span className="cal-year">date.getFullYear()</span>
            </div>
            <button onClick={handleNextMonth} className="cal-nav-btn">&gt;</button>
          </div>
          <div style={{flex: '1', justifyContent: 'flex-end', display: 'flex'}}>
            <button onClick={onClose} className="cal-close-btn">CLOSE</button>
          </div>
        </div>

        <div className="cal-body">
          {/* LEFT: GRID */}
        </div>

          {/* RIGHT: DETAILS PANEL */}
        <div className="cal-details-section">
          <h3 className="details-header">
            'SELECT A DATE'
            <span className="read-only-tag">READ ONLY</span>
          </h3>

          {/* Event List */}
          <div className="events-list">
            
          </div>

            {/* ADD FORM - HIDDEN IF DATE IS PAST */}
          <div className="past-warning">
            ⚠ Historical records cannot be modified.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;