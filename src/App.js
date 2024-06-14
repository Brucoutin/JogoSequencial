import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SequenceDisplay from './components/SequenceDisplay';
import Timer from './components/Timer';
import correct from './assets/Sounds/correct.mp3';
import incorret from './assets/Sounds/incorret.mp3';

const generateRandomSequence = (length) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let sequence = '';
  for (let i = 0; i < length; i++) {
    sequence += letters[Math.floor(Math.random() * letters.length)];
  }
  return sequence;
};

const App = () => {
  const [sequence, setSequence] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const correctAudioRef = useRef(new Audio(correct));
  const incorrectAudioRef = useRef(new Audio(incorret));
  const [congratulations, setCongratulations] = useState(false);

  // Gera uma nova sequência aleatória ao montar o componente
  useEffect(() => {
    setSequence(generateRandomSequence(5));
  }, []);

  // Controla o temporizador do jogo e verifica se o tempo acabou
  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const timerId = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver]);

  // Escuta os eventos de teclado e verifica se o jogador acertou ou errou
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return;

      if (event.key.toUpperCase() === sequence[currentIndex]) {
        correctAudioRef.current.play();
        setCorrectCount((prevCount) => prevCount + 1);
        if (currentIndex + 1 === sequence.length) {
          setGameOver(true);
          setCongratulations(true);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      } else {
        incorrectAudioRef.current.play();
        setGameOver(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, sequence, gameOver]);

  const handleButtonClick = (letter, index) => {
    if (gameOver) return;

    if (letter === sequence[currentIndex]) {
      correctAudioRef.current.play();
      setCorrectCount((prevCount) => prevCount + 1);
      if (currentIndex + 1 === sequence.length) {
        setGameOver(true);
        setCongratulations(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      incorrectAudioRef.current.play();
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setSequence(generateRandomSequence(5));
    setCurrentIndex(0);
    setTimer(10);
    setGameOver(false);
    setCorrectCount(0);
    setCongratulations(false);
  };

  return (
    <div className="app">
      <h1>Tecla Sequencial</h1>
      {gameOver ? (
        <div className="result-screen">
          <h2>Jogo Terminado</h2>
          {congratulations && <p className="congrats-message">Parabéns, você acertou todas!</p>}
          <p>Acertos: {correctCount}</p>
          <button onClick={resetGame} className="restart-button">Jogar novamente</button>
        </div>
      ) : (
        <div className="sequence-container">
          <SequenceDisplay sequence={sequence} currentIndex={currentIndex} />
          <Timer timeLeft={timer} />
          <div className="button-container">
            {sequence.split('').map((letter, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(letter, index)}
                className="letter-button"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
