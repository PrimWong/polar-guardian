import React, { useState, useEffect } from 'react';
import { Snowflake, Trash2, Recycle, Leaf, Heart, Star, Trophy, Globe } from 'lucide-react';

const PolarGuardianGame = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('start');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [carbonCredits, setCarbonCredits] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const wasteTypes = [
    {
      type: 'Plastic Water Bottle',
      correctBin: 'Recyclable',
      image: '🍾',
      material: 'Polyethylene Terephthalate (PET)',
      origin: 'Made from petroleum-based plastic',
      recyclingFact: 'Can be recycled into new bottles, clothing, and carpets',
      carbonImpact: '1.5'
    },
    {
      type: 'Banana Peel',
      correctBin: 'Compostable',
      image: '🍌',
      material: 'Organic Plant Waste',
      origin: 'Natural fruit skin from banana plant',
      recyclingFact: 'Decomposes quickly and creates nutrient-rich soil',
      carbonImpact: '0.5'
    },
    {
      type: 'Styrofoam Food Container',
      correctBin: 'Landfill',
      image: '📦',
      material: 'Polystyrene',
      origin: 'Petroleum-based synthetic polymer',
      recyclingFact: 'Difficult to recycle, takes 500+ years to decompose',
      carbonImpact: '2'
    }
  ];

  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    let feedbackTimer;
    if (feedback) {
      feedbackTimer = setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
    return () => clearTimeout(feedbackTimer);
  }, [feedback]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setTimeLeft(30);
    setCarbonCredits(0);
    setChallengeStreak(0);
    generateChallenge();
  };

  const generateChallenge = () => {
    const randomChallenge = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    setCurrentChallenge(randomChallenge);
  };

  const handleBinSelection = (selectedBin) => {
    if (!currentChallenge) return;

    if (selectedBin === currentChallenge.correctBin) {
      setScore((prev) => prev + 10);
      setChallengeStreak((prev) => prev + 1);
      setCarbonCredits((prev) => prev + parseFloat(currentChallenge.carbonImpact));
      setFeedback('✅ Correct! 😄');

      if ((challengeStreak + 1) % 5 === 0) {
        setLevel((prev) => prev + 1);
        setTimeLeft((prev) => prev + 10);
      }
    } else {
      setLives((prev) => Math.max(0, prev - 1));
      setChallengeStreak(0);
      setFeedback('❌ Oops! 😢');

      if (lives <= 1) {
        handleGameOver();
        return;
      }
    }

    generateChallenge();
  };

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  const renderGameScreen = () => {
    switch (gameState) {
      case 'start':
        return (
          <div className="text-center p-8 min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 via-white to-blue-200">
            <Snowflake className="text-sky-500 text-6xl mb-4" />
            <h1 className="text-5xl font-bold text-sky-800 drop-shadow-lg mb-3">Polar Guardian</h1>
            <p className="text-gray-600 mb-6">Save the Arctic by sorting waste correctly!</p>
            <button
              onClick={startGame}
              className="bg-sky-600 text-white px-6 py-3 rounded-full hover:bg-sky-700 transition transform hover:scale-105 shadow-md"
            >
              Start Game
            </button>
          </div>
        );

      case 'playing':
        return (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 relative">
              {feedback && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50 rounded-3xl">
                  <div className="text-5xl font-bold text-white">{feedback}</div>
                </div>
              )}

              <div className="flex justify-between mb-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Heart className="text-red-500" />
                  {lives} Lives
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" />
                  Level {level}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="text-green-500" />
                  {score} Points
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-sky-800 mb-2">Time Left: {timeLeft}s</h2>
                {currentChallenge && (
                  <div>
                    <div className="text-7xl mb-3 animate-bounce">{currentChallenge.image}</div>
                    <p className="text-lg font-medium">{currentChallenge.type}</p>
                  </div>
                )}
              </div>

              {currentChallenge && (
                <div className="bg-blue-100 rounded-xl p-4 text-sm mb-4 shadow-inner">
                  <p><strong>Material:</strong> {currentChallenge.material}</p>
                  <p><strong>Origin:</strong> {currentChallenge.origin}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {[
                  { bin: 'Recyclable', icon: <Recycle className="text-green-600" />, bg: 'bg-green-100' },
                  { bin: 'Compostable', icon: <Leaf className="text-yellow-600" />, bg: 'bg-yellow-100' },
                  { bin: 'Landfill', icon: <Trash2 className="text-red-600" />, bg: 'bg-red-100' }
                ].map(({ bin, icon, bg }) => (
                  <button
                    key={bin}
                    onClick={() => handleBinSelection(bin)}
                    className={`${bg} p-4 rounded-xl flex flex-col items-center hover:scale-105 transition transform shadow-sm hover:shadow-md`}
                  >
                    {icon}
                    <span className="mt-1 font-medium text-sm">{bin}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gameOver':
        return (
          <div className="text-center p-8 min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white via-blue-100 to-green-100">
            <Globe className="text-green-500 text-6xl mb-4" />
            <h1 className="text-4xl font-bold text-green-700 mb-3">You Are the Hero!</h1>
            <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md mb-4">
              <p className="text-lg mb-2">Today, You Saved the World</p>
              <div className="flex justify-around mt-4">
                <div>
                  <Star className="text-yellow-500 mx-auto mb-1" />
                  <p>Score: {score}</p>
                </div>
                <div>
                  <Leaf className="text-green-500 mx-auto mb-1" />
                  <p>Carbon Credits: {carbonCredits.toFixed(1)} kg</p>
                </div>
              </div>
            </div>
            <p className="mb-6 text-gray-600 text-sm">
              Your waste sorting helped reduce carbon emissions and protect our planet!
            </p>
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition transform hover:scale-105 shadow-md"
              >
                Play Again
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition transform hover:scale-105 shadow-md">
                Share & Challenge Friends
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderGameScreen()}</div>;
};

export default PolarGuardianGame;
