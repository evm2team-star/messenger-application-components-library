import React, { useState } from 'react';
import './CreateGroupModal.css'; 
interface User {
    ip: string;
    name: string;
    online: boolean;
}

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, users }) => {
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    
    // Optional: Group Image (Just storing the path/name for now as logic handled by FileService)
    const [imageName, setImageName] = useState<string | null>(null);

    if (!isOpen) return null;

    // Filter users based on search
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.ip.includes(searchTerm)
    );

    const toggleUser = (ip: string) => {
        if (selectedUsers.includes(ip)) {
            setSelectedUsers(prev => prev.filter(id => id !== ip));
        } else {
            setSelectedUsers(prev => [...prev, ip]);
        }
    };

    const handleCreate = () => {
        if (!groupName.trim()) {
          window.electronAPI.openDialog('alert', 'Group Name is required!');
          return;
        }
        if (selectedUsers.length === 0) {
          window.electronAPI.openDialog('alert', 'Select at least one member.');
          return;
        }

        // Send logic to Main Process (which sends to Java)
        // Format: CREATE_GROUP Name|Desc|IP1,IP2,IP3
        console.log(`Creating Group: ${groupName} with ${selectedUsers.length} members`);
        
        // TODO: window.electronAPI.send("CREATE_GROUP", `${groupName}|${groupDesc}|${selectedUsers.join(',')}`);
        
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel group-modal-panel">
                <div className="cal-header">
                    <div className="cal-title">
                        <h2>CREATE SECURE GROUP</h2>
                    </div>
                    <button onClick={onClose} className="cal-close-btn">CANCEL</button>
                </div>

                <div className="group-modal-body">
                    {/* LEFT: FORM */}
                    <div className="group-form-section">
                        <label className="input-label">GROUP NAME *</label>
                        <input 
                            type="text" 
                            className="cal-input" 
                            placeholder="E.g. Project Alpha Team"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                        />

                        <label className="input-label">DESCRIPTION (OPTIONAL)</label>
                        <textarea 
                            className="cal-input" 
                            rows={3}
                            placeholder="Purpose of this channel..."
                            value={groupDesc}
                            onChange={e => setGroupDesc(e.target.value)}
                        />

                        <label className="input-label">GROUP ICON (OPTIONAL)</label>
                        <div className="file-upload-box">
                            <label className="custom-file-upload">
                                <input type="file" onChange={(e) => setImageName(e.target.files?.[0]?.name || null)} />
                                {imageName ? `📂 ${imageName}` : "Click to Upload Image"}
                            </label>
                        </div>
                    </div>

                    {/* RIGHT: USER SELECTOR */}
                    <div className="group-members-section">
                        <label className="input-label">SELECT MEMBERS ({selectedUsers.length})</label>
                        
                        <input 
                            type="text" 
                            className="cal-input search-input" 
                            placeholder="Search by Name or IP..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />

                        <div className="member-selection-list">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <div 
                                        key={user.ip} 
                                        className={`member-item ${selectedUsers.includes(user.ip) ? 'selected' : ''}`}
                                        onClick={() => toggleUser(user.ip)}
                                    >
                                        <div className={`status-dot ${user.online ? 'online' : 'offline'}`}></div>
                                        <div className="member-info">
                                            <span className="m-name">{user.name}</span>
                                            <span className="m-ip">{user.ip}</span>
                                        </div>
                                        <div className="checkbox-indicator">
                                            {selectedUsers.includes(user.ip) && "✔"}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">No active users found.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="group-modal-footer">
                    <button className="create-group-btn" onClick={handleCreate}>
                        INITIALIZE GROUP CHANNEL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;