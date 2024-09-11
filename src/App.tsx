import React, { useState, useEffect, useCallback } from "react";

type Position = { x: number; y: number };

const DEFAULT_SPEED = 200;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 20, y: 20 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const gridSize = 20;
  const boardSize = 800;
  const gridCount = Math.floor(boardSize / gridSize);

  const getRandomPosition = useCallback(() => {
    return {
      x: Math.floor(Math.random() * gridCount),
      y: Math.floor(Math.random() * gridCount),
    };
  }, [gridCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        // Check if the snake hits the border
        if (
          head.x < 0 ||
          head.x >= gridCount ||
          head.y < 0 ||
          head.y >= gridCount
        ) {
          // alert("Game Over");
          setSpeed(DEFAULT_SPEED);
          return [{ x: 10, y: 10 }]; // Reset the game
        }

        // Check if the snake eats the food
        if (head.x === food.x && head.y === food.y) {
          // Add a new segment to the snake at the tail's position
          const tail = newSnake[newSnake.length - 1];
          newSnake.push(tail); // Grow the snake by duplicating the tail
          setSpeed((ps) => ps - 5);
          setFood(getRandomPosition()); // Set new food position
        } else {
          newSnake.pop(); // Remove the tail if no food eaten
        }

        // Add new head
        newSnake.unshift(head);
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [direction, food, getRandomPosition, gridCount, speed]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${boardSize}px`,
          height: `${boardSize}px`,
          backgroundColor: "lightgray",
          border: "2px solid black",
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${segment.x * gridSize}px`,
              top: `${segment.y * gridSize}px`,
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              backgroundColor: "green",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: `${food.x * gridSize}px`,
            top: `${food.y * gridSize}px`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            backgroundColor: "red",
          }}
        />
      </div>
    </div>
  );
};

export default SnakeGame;
