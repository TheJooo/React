// PongGame.tsx
import React, { useEffect, useRef } from 'react';

const PongGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Game settings
  const canvasWidth = 600;
  const canvasHeight = 400;
  const paddleWidth = 10;
  const paddleHeight = 80;
  const ballSize = 10;

  // Initial speeds
  const initialBallSpeedX = 2;
  const initialBallSpeedY = 1;

  // Mutable game variables using refs
  const playerY = useRef(canvasHeight / 2 - paddleHeight / 2);
  const computerY = useRef(canvasHeight / 2 - paddleHeight / 2);
  const ballX = useRef(canvasWidth / 2 - ballSize / 2);
  const ballY = useRef(canvasHeight / 2 - ballSize / 2);
  const ballSpeedX = useRef(initialBallSpeedX);
  const ballSpeedY = useRef(initialBallSpeedY);

  // Track pressed keys for player's paddle
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw player paddle (blue)
    ctx.fillStyle = 'blue';
    ctx.fillRect(10, playerY.current, paddleWidth, paddleHeight);

    // Draw computer paddle (red)
    ctx.fillStyle = 'red';
    ctx.fillRect(canvasWidth - paddleWidth - 10, computerY.current, paddleWidth, paddleHeight);

    // Draw ball (green)
    ctx.fillStyle = 'green';
    ctx.fillRect(ballX.current, ballY.current, ballSize, ballSize);

    // Update ball position
    ballX.current += ballSpeedX.current;
    ballY.current += ballSpeedY.current;

    // Bounce off top/bottom walls
    if (ballY.current <= 0 || ballY.current + ballSize >= canvasHeight) {
      ballSpeedY.current = -ballSpeedY.current;
    }

    // Update player's paddle based on arrow keys
    const playerSpeed = 5;
    if (keysPressed.current['ArrowUp']) {
      playerY.current -= playerSpeed;
    }
    if (keysPressed.current['ArrowDown']) {
      playerY.current += playerSpeed;
    }
    // Clamp player's paddle within canvas
    if (playerY.current < 0) playerY.current = 0;
    if (playerY.current > canvasHeight - paddleHeight) playerY.current = canvasHeight - paddleHeight;

    // Update computer paddle with limited AI and deadzone
    const computerSpeed = 3;
    const computerCenter = computerY.current + paddleHeight / 2;
    const ballCenter = ballY.current + ballSize / 2;
    if (computerCenter < ballCenter - 10) {
      computerY.current += computerSpeed;
    } else if (computerCenter > ballCenter + 10) {
      computerY.current -= computerSpeed;
    }
    // Clamp computer's paddle
    if (computerY.current < 0) computerY.current = 0;
    if (computerY.current > canvasHeight - paddleHeight) computerY.current = canvasHeight - paddleHeight;

    // Collision with player's paddle
    if (
      ballX.current <= 10 + paddleWidth &&
      ballY.current + ballSize >= playerY.current &&
      ballY.current <= playerY.current + paddleHeight
    ) {
      // Calculate difference between ball center and paddle center
      const diff = (ballY.current + ballSize / 2) - (playerY.current + paddleHeight / 2);
      // Adjust ball's vertical speed based on collision point
      ballSpeedY.current = diff * 0.15;
      // Reverse horizontal direction
      ballSpeedX.current = -ballSpeedX.current;
      ballX.current = 10 + paddleWidth; // reposition ball to avoid sticking
    }

    // Collision with computer paddle
    if (
      ballX.current + ballSize >= canvasWidth - paddleWidth - 10 &&
      ballY.current + ballSize >= computerY.current &&
      ballY.current <= computerY.current + paddleHeight
    ) {
      ballSpeedX.current = -ballSpeedX.current;
      ballX.current = canvasWidth - paddleWidth - 10 - ballSize;
    }

    // Reset ball if it goes off-screen
    if (ballX.current < 0 || ballX.current > canvasWidth) {
      ballX.current = canvasWidth / 2 - ballSize / 2;
      ballY.current = canvasHeight / 2 - ballSize / 2;
      ballSpeedX.current = initialBallSpeedX * (Math.random() > 0.5 ? 1 : -1);
      ballSpeedY.current = initialBallSpeedY * (Math.random() > 0.5 ? 1 : -1);
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);

    // Add keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={onClose} style={{ marginBottom: '10px' }}>
        Close Pong
      </button>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: '1px solid black', backgroundColor: '#eee' }}
      />
    </div>
  );
};

export default PongGame;
