import React, { useState } from 'react';
import { monthNames } from './constants';
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

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, users }) => {
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // Form Inputs
  const [noteInput, setNoteInput] = useState('');
  const [eventType, setEventType] = useState<'meeting' | 'todo'>('meeting'); // Toggle State
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  if (!isOpen) return null;

  // --- CALENDAR MATH ---
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // --- LOGIC: CHECK IF DATE IS PAST ---
  const isDatePast = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time

    const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
    return checkDate < today;
  };

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const handleAddEvent = () => {
    if (!selectedDay || !noteInput.trim()) return;

    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${selectedDay}`;

    const newEvent: Event = {
      id: Date.now(),
      date: dateStr,
      title: noteInput,
      type: eventType,
      participants: eventType === 'meeting' ? selectedParticipants : [], // To-Dos might not need users
      isCompleted: false
    };

    setEvents([...events, newEvent]);
    setNoteInput('');
    setSelectedParticipants([]);
    // Keep the type selection for convenience
  };

  const toggleParticipant = (ip: string) => {
    if (selectedParticipants.includes(ip)) {
      setSelectedParticipants(prev => prev.filter(p => p !== ip));
    } else {
      setSelectedParticipants(prev => [...prev, ip]);
    }
  };

  // Toggle To-Do Checkbox
  const toggleTodoComplete = (eventId: number) => {
    setEvents(events.map(ev =>
      ev.id === eventId ? { ...ev, isCompleted: !ev.isCompleted } : ev
    ));
  };

  const isPast = selectedDay ? isDatePast(selectedDay) : false;

  return (
    <div className="modal-overlay">
      <div className="calendar-container glass-panel">
        {/* HEADER */}
        <div className="cal-header">
          <div style={{flex: '3', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '10px'}}>
            <button onClick={handlePrevMonth} className="cal-nav-btn">&lt;</button>
            <div className="cal-title">
              <h2>{monthNames[date.getMonth()]}</h2>
              <span className="cal-year">{date.getFullYear()}</span>
            </div>
            <button onClick={handleNextMonth} className="cal-nav-btn">&gt;</button>
          </div>
          <div style={{flex: '1', justifyContent: 'flex-end', display: 'flex'}}>
            <button onClick={onClose} className="cal-close-btn">CLOSE</button>
          </div>
        </div>

        <div className="cal-body">
          {/* LEFT: GRID */}
          <div className="cal-grid-section">
            <div className="cal-days-header">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <div key={d} className="day-name">{d}</div>
              ))}
            </div>
            <div className="cal-grid">
              {Array.from({ length: firstDayIndex }).map((_, i: number) => (
                <div key={`empty-${i}`} className="cal-day empty"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i: number) => {
                const dayNum = i + 1;
                const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${dayNum}`;
                const dayEvents = events.filter(e => e.date === dateStr);
                const isDayPast = isDatePast(dayNum);

                return (
                  <div
                    key={dayNum}
                    className={`cal-day ${selectedDay === dayNum ? 'selected' : ''} ${isDayPast ? 'past-day' : ''}`}
                    onClick={() => setSelectedDay(dayNum)}
                  >
                    <span className="day-number">{dayNum}</span>
                      {
                        (dayEvents.length < 8) ?
                        <div className="day-dots">
                          {
                            dayEvents.map((events: Event, idx: number) => (
                              <div key={`event-dot-${idx}`} className={`event-dot ${events.type}`}/>
                            ))
                          }
                        </div>
                        :
                        <div className="day-dots-overflow">
                          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <div className="event-dot-overflow-date">
                              +{dayEvents.length}
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                              {Array.from(new Set(dayEvents.map(e => e.type))).map((type, _idx) => (
                                <div className={`event-dot ${type}`} style={{marginLeft: '4px'}}/>
                              ))}
                            </div>
                          </div> 
                        </div>
                      }
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: DETAILS PANEL */}
          <div className="cal-details-section">
            <h3 className="details-header">
              {selectedDay
                ? `${selectedDay} ${monthNames[date.getMonth()]}`
                : 'SELECT A DATE'}
              {isPast && selectedDay && <span className="read-only-tag">READ ONLY</span>}
            </h3>

            {/* Event List */}
            <div className="events-list">
              {selectedDay ? (
                events
                  .filter(e => e.date === `${date.getFullYear()}-${date.getMonth() + 1}-${selectedDay}`)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      // CRITICAL: This adds the 'completed' class when ev.isCompleted is true
                      className={`event-item ${ev.type} ${ev.isCompleted ? 'completed' : ''}`}
                    >
                      <div className="ev-top-row">
                        <span className="ev-type-badge">{ev.type}</span>
                        {ev.type === 'todo' && (
                          <input
                            type="checkbox"
                            checked={ev.isCompleted}
                            onChange={() => toggleTodoComplete(ev.id)}
                            className="todo-checkbox"
                          />
                        )}
                      </div>
                      {/* The .strike class is optional now as CSS handles .completed .ev-title */}
                      <span className="ev-title">{ev.title}</span>

                      {ev.type === 'meeting' && ev.participants && ev.participants.length > 0 && (
                        <div className="ev-participants">
                          {ev.participants.length} Users Invited
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="no-events">Select a date.</div>
              )}
              {selectedDay && events.filter(e => e.date === `${date.getFullYear()}-${date.getMonth() + 1}-${selectedDay}`).length === 0 && (
                <div className="no-events">No items.</div>
              )}
            </div>

            {/* ADD FORM - HIDDEN IF DATE IS PAST */}
            {selectedDay && !isPast ? (
              <div className="add-event-form">
                {/* Type Selector */}
                <div className="type-selector">
                  <button
                    className={`type-btn ${eventType === 'meeting' ? 'active' : ''}`}
                    onClick={() => setEventType('meeting')}
                  >
                    MEETING
                  </button>
                  <button
                    className={`type-btn ${eventType === 'todo' ? 'active' : ''}`}
                    onClick={() => setEventType('todo')}
                  >
                    TO-DO LIST
                  </button>
                </div>

                <input
                  type="text"
                  className="cal-input"
                  placeholder={eventType === 'meeting' ? "Meeting Title..." : "Task Description..."}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                />

                {/* Only show Nominations for Meetings */}
                {eventType === 'meeting' && (
                  <div className="nominate-section">
                    <span className="label">INVITE USERS:</span>
                    <div className="nominate-list">
                      {users.map(u => (
                        <div
                          key={u.ip}
                          className={`nominate-chip ${selectedParticipants.includes(u.ip) ? 'picked' : ''}`}
                          onClick={() => toggleParticipant(u.ip)}
                        >
                          {u.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="cal-add-btn" onClick={handleAddEvent}>
                  {eventType === 'meeting' ? 'SCHEDULE MEETING' : 'ADD TASK'}
                </button>
              </div>
            ) : selectedDay && isPast && (
              <div className="past-warning">
                ⚠ Historical records cannot be modified.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;