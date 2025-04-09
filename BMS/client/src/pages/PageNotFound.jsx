import React, { useState, useEffect, useRef } from 'react';

const PageNotFound = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [funFacts, setFunFacts] = useState([
    "The first 404 error occurred in 1984",
    "404 comes from 'Room 404' where web servers were kept",
    "Some websites have 'Easter eggs' hidden in their 404 pages",
    "Studies show users abandon sites after encountering 404 errors",
    "The most common cause of 404s is deleted or moved content"
  ]);
  const [currentFact, setCurrentFact] = useState(0);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  
  // Move the 404 number when mouse moves
  const handleMouseMove = (e) => {
    if (!isHovering && !gameActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ 
      x: Math.min(Math.max(x, 10), 90), 
      y: Math.min(Math.max(y, 10), 90) 
    });
    
    // For the game mode: check collisions
    if (gameActive) {
      checkCollisions(x, y);
    }
  };
  
  const checkCollisions = (x, y) => {
    const cursorRadius = 5;
    
    setCharacters(prev => {
      const updatedChars = prev.filter(char => {
        const dx = char.x - x;
        const dy = char.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If collision detected
        if (distance < cursorRadius + 3) {
          // Add score
          setGameScore(score => score + 1);
          addEmoji();
          return false;
        }
        return true;
      });
      
      return updatedChars;
    });
  };
  
  // Add floating emoji effect
  const addEmoji = () => {
    const randomEmoji = ['😮', '😵', '🤔', '🙄', '👻', '🚀', '🌟', '💫', '🔍', '🧭', '🎮', '🎯', '🎪', '🦄', '⚡'][Math.floor(Math.random() * 15)];
    const id = Date.now() + Math.random();
    const startX = Math.random() * 80 + 10;
    
    setEmojis(prev => [...prev, { id, emoji: randomEmoji, x: startX, y: 80 }]);
    
    // Remove emoji after animation completes
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };
  
  const handleGoHome = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addEmoji(), i * 100);
    }
    // In a real app: router.push('/');
    window.location.href = '/';
  };
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    addEmoji();
  };
  
  const handle404Click = () => {
    addEmoji();
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 10 && !showEasterEgg) {
        setShowEasterEgg(true);
        for (let i = 0; i < 20; i++) {
          setTimeout(() => addEmoji(), i * 50);
        }
      }
      return newCount;
    });
  };
  
  const toggleGame = () => {
    if (gameActive) {
      // End game
      setGameActive(false);
      clearInterval(timerRef.current);
    } else {
      // Start game
      setGameActive(true);
      setGameScore(0);
      setCharacters([]);
      
      // Spawn characters at interval
      timerRef.current = setInterval(() => {
        if (Math.random() > 0.5) {
          const char = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            char: '404'[Math.floor(Math.random() * 3)],
            rotation: Math.random() * 360,
            speed: Math.random() * 1 + 0.5
          };
          
          setCharacters(prev => [...prev, char]);
          
          // Remove character after some time if not caught
          setTimeout(() => {
            setCharacters(prev => prev.filter(c => c.id !== char.id));
          }, 5000);
        }
      }, 800);
    }
  };
  
  const cycleFunFact = () => {
    setCurrentFact(prev => (prev + 1) % funFacts.length);
    addEmoji();
  };
  
  // Random background effects
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) addEmoji();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Cycle fun facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % funFacts.length);
    }, 8000);
    
    return () => clearInterval(factInterval);
  }, [funFacts.length]);
  
  // Clean up game on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center justify-center min-h-screen px-4 py-12 transition-colors duration-500 overflow-hidden relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5 pointer-events-none">
        {Array(144).fill().map((_, i) => (
          <div 
            key={i} 
            className={`border border-current ${darkMode ? 'border-white' : 'border-black'}`}
          />
        ))}
      </div>
      
      {/* Animated emoji particles */}
      {emojis.map(({ id, emoji, x, y }) => (
        <div 
          key={id}
          className="absolute text-2xl animate-float pointer-events-none"
          style={{ 
            left: `${x}%`, 
            top: `${y}%`,
            animation: 'float 2s ease-out forwards'
          }}
        >
          {emoji}
        </div>
      ))}
      
      {/* Game characters */}
      {gameActive && characters.map((char) => (
        <div 
          key={char.id}
          className="absolute text-xl font-bold transition-all duration-300 cursor-pointer"
          style={{ 
            left: `${char.x}%`, 
            top: `${char.y}%`,
            transform: `rotate(${char.rotation}deg)`,
            color: darkMode ? '#a5b4fc' : '#6366f1'
          }}
        >
          {char.char}
        </div>
      ))}
      
      {/* Score display for game */}
      {gameActive && (
        <div className="absolute top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded-full">
          Score: {gameScore}
        </div>
      )}
      
      {/* Main content */}
      <div className="z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Interactive 404 number */}
        <div 
          className={`text-9xl font-bold mb-4 transition-all duration-300 cursor-pointer select-none relative ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}
          style={{ 
            transform: `translate(${(position.x - 50) / 5}px, ${(position.y - 50) / 5}px) rotate(${(position.x - 50) / 25}deg)`,
            textShadow: isHovering ? '0 10px 20px rgba(79, 70, 229, 0.4)' : '0 4px 6px rgba(79, 70, 229, 0.1)'
          }}
          onClick={handle404Click}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            if (!gameActive) setPosition({ x: 50, y: 50 });
          }}
        >
          404
          
          {/* Particles around the 404 */}
          {isHovering && Array(5).fill().map((_, i) => (
            <span 
              key={i} 
              className="absolute inline-block rounded-full"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: darkMode ? '#a5b4fc' : '#6366f1',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                transform: `translate(-50%, -50%)`,
                filter: 'blur(1px)',
                animation: `float ${Math.random() * 3 + 2}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
        
        <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Page Not Found
        </h1>
        
        <p className={`text-center max-w-md mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Oops! The page you're looking for seems to have wandered off.
        </p>
        
        {/* Fun facts section */}
        <div 
          className={`text-sm italic mb-6 p-3 rounded-lg transition-all cursor-pointer hover:scale-105 ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}
          onClick={cycleFunFact}
        >
          <span className="font-medium">404 Fun Fact:</span> {funFacts[currentFact]}
        </div>
        
        {/* Interactive search box */}
        <div className="w-full max-w-md mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Try searching for something else..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'
              }`}
            />
            <button 
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xl ${
                darkMode ? 'text-indigo-400' : 'text-indigo-500'
              }`}
              onClick={addEmoji}
            >
              🔍
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button 
            onClick={handleGoHome}
            className={`px-6 py-3 font-medium rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              darkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            Go Home
          </button>
          
          <button 
            onClick={() => { 
              for (let i = 0; i < 3; i++) {
                setTimeout(() => addEmoji(), i * 100);
              }
              window.history.back(); 
            }}
            className={`px-6 py-3 font-medium rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Go Back
          </button>
        </div>
        
        {/* Mini-game button */}
        <button
          onClick={toggleGame}
          className={`mb-4 px-4 py-2 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105 ${
            gameActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : darkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
          }`}
        >
          {gameActive ? 'End Game' : 'Play 404 Catcher Game'}
        </button>
        
        {/* Easter egg section */}
        {showEasterEgg && (
          <div className={`mt-2 p-4 rounded-lg transition-all animate-bounce ${
            darkMode ? 'bg-indigo-900' : 'bg-indigo-100'
          }`}>
            <p className="font-medium">🎉 You found the Easter egg! 🎉</p>
            <input 
              type="text" 
              placeholder="Enter konami code..." 
              className={`mt-2 w-full px-3 py-1 rounded border text-sm ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              onChange={(e) => {
                if (e.target.value.toLowerCase() === 'up up down down left right left right b a') {
                  // Activate super easter egg
                  document.body.style.transform = 'rotate(180deg)';
                  document.body.style.transition = 'transform 1s';
                  setTimeout(() => {
                    document.body.style.transform = 'none';
                  }, 3000);
                  
                  for (let i = 0; i < 30; i++) {
                    setTimeout(() => addEmoji(), i * 50);
                  }
                }
              }}
            />
          </div>
        )}
        
        {/* Footer controls */}
        <div className="absolute bottom-4 flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Sound toggle (placeholder) */}
          <button
            onClick={addEmoji}
            className="p-3 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          >
            🔊
          </button>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 2s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.9);
          }
        }
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;