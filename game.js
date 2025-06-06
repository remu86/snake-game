
const CANVAS_BORDER_COLOR = '#333';
const CANVAS_BACKGROUND_COLOR = "#1a1a1a";
const SNAKE_COLOR = "#66ff66"; 
const SNAKE_BORDER_COLOR = "#003300";
const SNAKE_HEAD_COLOR = "#99ff99"; 
const FOOD_COLOR = "#ff4d4d"; 
const FOOD_BORDER_COLOR = "#800000";
const GRID_SIZE = 20; 
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

let canvas, ctx, snake, food, dx, dy, user;
let score = 0;
let changingDirection = false; 
let gameLoopInterval;
let isGameOver = false;

const userForm = document.getElementById('userForm');
const gameArea = document.getElementById('gameArea');
const greetingEl = document.getElementById('greeting');
const scoreEl = document.getElementById('score');
const canvasEl = document.getElementById("gameCanvas"); 
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
const ENTER_KEY = 13;

function initGame() {
  user = document.getElementById('username').value.trim();
  if (!user) {
    alert("請輸入名稱！");
    return;
  }

  userForm.style.display = 'none';
  gameArea.style.display = 'block';
  gameOverScreen.style.display = 'none'; 
  greetingEl.innerText = `玩家：${user}`;

  canvas = canvasEl; 
  ctx = canvas.getContext("2d");

  document.removeEventListener("keydown", changeDirection);
  document.removeEventListener("keydown", handleRestart);

  document.addEventListener("keydown", changeDirection);

  resetGame(); 
}

function resetGame() {
    isGameOver = false;
    score = 0;
    scoreEl.innerText = score;
    snake = [ 
        { x: CANVAS_WIDTH / 2 - GRID_SIZE, y: CANVAS_HEIGHT / 2 },
        { x: CANVAS_WIDTH / 2 - 2 * GRID_SIZE, y: CANVAS_HEIGHT / 2 },
        { x: CANVAS_WIDTH / 2 - 3 * GRID_SIZE, y: CANVAS_HEIGHT / 2 }
    ];
    dx = GRID_SIZE; 
    dy = 0;
    changingDirection = false;
    gameOverScreen.style.display = 'none'; 

    createFood();
    startGameLoop();
}

function startGameLoop() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
    }
    gameLoopInterval = setInterval(gameTick, 120);
}

function stopGameLoop() {
    clearInterval(gameLoopInterval);
}

function gameTick() {
  if (isGameOver) return;

  changingDirection = false; 
  clearCanvas();
  moveSnake();
  drawFood();
  drawSnake();
  checkCollision();
}

function clearCanvas() {
  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
  ctx.strokeStyle = CANVAS_BORDER_COLOR; 

  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}


function moveSnake() {
  // Calculate new head position
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // Add new head to the beginning of the snake array
  snake.unshift(head);

  // Check if snake ate food
  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
  if (didEatFood) {
    // Increase score
    score += 10;
    scoreEl.innerText = score;
    // Generate new food location
    createFood();
    // Optional: Increase speed slightly
    // if (score % 50 === 0) { /* Increase speed logic */ }
  } else {
    // Remove the last part of snake's tail if no food was eaten
    snake.pop();
  }
}

/**
 * Draws the snake on the canvas.
 */
function drawSnake() {
  snake.forEach((part, index) => {
    // Style the head differently
    ctx.fillStyle = (index === 0) ? SNAKE_HEAD_COLOR : SNAKE_COLOR;
    ctx.strokeStyle = SNAKE_BORDER_COLOR;
    // Draw filled rectangle for snake part
    ctx.fillRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
    // Draw border around snake part
    ctx.strokeRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
  });
}

/**
 * Draws the food on the canvas.
 */
function drawFood() {
  ctx.fillStyle = FOOD_COLOR;
  ctx.strokeStyle = FOOD_BORDER_COLOR;
  ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
  ctx.strokeRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
}

/**
 * Generates random coordinates for the food, avoiding snake body.
 */
function createFood() {
  let foodX, foodY;
  while (true) {
      foodX = Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)) * GRID_SIZE;
      foodY = Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)) * GRID_SIZE;
      // Check if the food location overlaps with the snake
      let overlap = snake.some(part => part.x === foodX && part.y === foodY);
      if (!overlap) break; // Found a valid spot
  }
  food = { x: foodX, y: foodY };
}

function changeDirection(event) {
 
  if (isGameOver || changingDirection) return;

  changingDirection = true; 

  const keyPressed = event.keyCode;

  const goingUp = dy === -GRID_SIZE;
  const goingDown = dy === GRID_SIZE;
  const goingRight = dx === GRID_SIZE;
  const goingLeft = dx === -GRID_SIZE;

  if (keyPressed === LEFT_KEY && !goingRight) { dx = -GRID_SIZE; dy = 0; }
  else if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -GRID_SIZE; }
  else if (keyPressed === RIGHT_KEY && !goingLeft) { dx = GRID_SIZE; dy = 0; }
  else if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = GRID_SIZE; }
  else {
      changingDirection = false;
  }
}

function checkCollision() {
  const head = snake[0];

  const hitLeftWall = head.x < 0;
  const hitRightWall = head.x >= CANVAS_WIDTH;
  const hitTopWall = head.y < 0;
  const hitBottomWall = head.y >= CANVAS_HEIGHT;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    gameOver();
    return;
  }

  for (let i = 4; i < snake.length; i++) { 
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }
}

function gameOver() {
  isGameOver = true;
  stopGameLoop(); 
  finalScoreEl.innerText = score; 
  gameOverScreen.style.display = 'block'; 

  document.removeEventListener("keydown", changeDirection);
  document.addEventListener("keydown", handleRestart);
}


function handleRestart(event) {
    if (event.keyCode === ENTER_KEY) {
        document.removeEventListener("keydown", handleRestart); 
        initGame(); 
    }
}
