import React from 'react';
import './Timer.css';

const Timer = ({ timeLeft }) => {
  return (
    <div className="timer">
      {timeLeft}
    </div>
  );
};

export default Timer;
