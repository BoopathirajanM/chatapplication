import React from 'react';

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">
        {users.length === 1 
          ? `${users[0]} is typing...` 
          : `${users.join(', ')} are typing...`
        }
      </span>
    </div>
  );
};

export default TypingIndicator;
