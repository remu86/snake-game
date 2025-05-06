let canvas, ctx, snake, food, dx, dy, user;

function startGame() {
  user = document.getElementById('username').value;
  if (!user) return alert("請輸入名稱");

  document.getElementById('userForm').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  document.getElementById('greeting').innerText = `玩家：${user}`;

  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  document.addEventListener("keydown", changeDirection);

  snake = [{ x: 160, y: 160 }];
  dx = 20;
  dy = 0;
  createFood();
  setInterval(draw, 100);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  snake.unshift({ x: snake[0].x + dx, y: snake[0].y + dy });

  if (snake[0].x === food.x && snake[0].y === food.y) {
    createFood();
  } else {
    snake.pop();
  }

  for (let part of snake) {
    ctx.fillStyle = "lime";
    ctx.fillRect(part.x, part.y, 20, 20);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);

  if (checkCollision()) {
    alert(`${user}，你輸了！`);
    document.location.reload();
  }
}

function changeDirection(e) {
  const key = e.keyCode;
  if (key === 37 && dx === 0) { dx = -20; dy = 0; }
  else if (key === 38 && dy === 0) { dx = 0; dy = -20; }
  else if (key === 39 && dx === 0) { dx = 20; dy = 0; }
  else if (key === 40 && dy === 0) { dx = 0; dy = 20; }
}

function createFood() {
  food = {
    x: Math.floor(Math.random() * 20) * 20,
    y: Math.floor(Math.random() * 20) * 20
  };
}

function checkCollision() {
  const head = snake[0];
  return head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 ||
    snake.slice(1).some(part => part.x === head.x && part.y === head.y);
}
