import React from 'react';
import './SequenceDisplay.css';

const SequenceDisplay = ({ sequence, currentIndex }) => {
  return (
    <div className="sequence-display">
      {sequence.split('').map((char, index) => (
        <span key={index} className={index === currentIndex ? 'highlight' : ''}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default SequenceDisplay;
