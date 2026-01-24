// Snake Game for Portfolio
const snakeCanvas = document.getElementById('snakeGameCanvas');
const snakeScoreElement = document.getElementById('snakeScore');
const snakeFinalScoreElement = document.getElementById('snakeFinalScore');
const snakeGameOverScreen = document.getElementById('snakeGameOverScreen');

let TILE_SIZE = 20;
const GAME_SPEED = 100;

let snake = [];
let food = {};
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let running = false;
let gameOver = false;
let score = 0;
let gameLoop = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (snakeCanvas) {
        initSnakeGame();
    }
});

function initSnakeGame() {
    // Set initial canvas size
    resizeSnakeCanvas();
    
    // Setup mobile controls
    setupSnakeMobileControls();
    
    // Start the game
    startSnakeGame();
    
    // Handle window resize
    window.addEventListener('resize', resizeSnakeCanvas);
}

function resizeSnakeCanvas() {
    if (!snakeCanvas) return;
    
    const container = snakeCanvas.parentElement;
    if (!container) return;
    
    // Make canvas square to match game aspect ratio
    const size = Math.min(container.clientWidth, container.clientHeight);
    
    snakeCanvas.width = size;
    snakeCanvas.height = size;
    
    // Recalculate tile size based on canvas size
    TILE_SIZE = Math.max(15, Math.floor(size / 25));
    
    // Redraw if game is running
    if (running) {
        drawSnakeGame();
    }
}

function setupSnakeMobileControls() {
    const btnUp = document.getElementById('snakeBtnUp');
    const btnDown = document.getElementById('snakeBtnDown');
    const btnLeft = document.getElementById('snakeBtnLeft');
    const btnRight = document.getElementById('snakeBtnRight');

    if (!btnUp || !btnDown || !btnLeft || !btnRight) return;

    // Prevent default touch behavior
    [btnUp, btnDown, btnLeft, btnRight].forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    btnUp.addEventListener('click', () => {
        if (running && direction !== 'DOWN') nextDirection = 'UP';
    });

    btnDown.addEventListener('click', () => {
        if (running && direction !== 'UP') nextDirection = 'DOWN';
    });

    btnLeft.addEventListener('click', () => {
        if (running && direction !== 'RIGHT') nextDirection = 'LEFT';
    });

    btnRight.addEventListener('click', () => {
        if (running && direction !== 'LEFT') nextDirection = 'RIGHT';
    });

    // Touch support for better mobile experience
    btnUp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (running && direction !== 'DOWN') nextDirection = 'UP';
    });

    btnDown.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (running && direction !== 'UP') nextDirection = 'DOWN';
    });

    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (running && direction !== 'RIGHT') nextDirection = 'LEFT';
    });

    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (running && direction !== 'LEFT') nextDirection = 'RIGHT';
    });
}

function startSnakeGame() {
    const ctx = snakeCanvas.getContext('2d');
    if (!ctx) return;
    
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    gameOver = false;
    running = true;
    
    updateSnakeScore();
    if (snakeGameOverScreen) snakeGameOverScreen.classList.remove('show');
    spawnFood();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateSnakeGame, GAME_SPEED);
    
    // Draw initial game state
    drawSnakeGame();
}

function spawnFood() {
    let validPosition = false;
    const maxX = Math.floor(snakeCanvas.width / TILE_SIZE);
    const maxY = Math.floor(snakeCanvas.height / TILE_SIZE);
    
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
        validPosition = !snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        );
    }
}

function updateSnakeGame() {
    if (!running) return;

    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
    }

    // Calculate grid boundaries
    const maxX = Math.floor(snakeCanvas.width / TILE_SIZE);
    const maxY = Math.floor(snakeCanvas.height / TILE_SIZE);

    // Check wall collision
    if (head.x < 0 || head.x >= maxX || 
        head.y < 0 || head.y >= maxY) {
        endSnakeGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endSnakeGame();
        return;
    }

    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateSnakeScore();
        spawnFood();
    } else {
        snake.pop();
    }

    drawSnakeGame();
}

function drawSnakeGame() {
    const ctx = snakeCanvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#9bbc0f';
    ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#8bbc0f';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x <= snakeCanvas.width; x += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, snakeCanvas.height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= snakeCanvas.height; y += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(snakeCanvas.width, y);
        ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#306230';
    ctx.fillRect(
        food.x * TILE_SIZE,
        food.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#0f380f' : '#306230';
        ctx.fillRect(
            segment.x * TILE_SIZE,
            segment.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        );
        
        // Draw eyes on head
        if (index === 0) {
            ctx.fillStyle = '#9bbc0f';
            const eyeSize = Math.max(2, TILE_SIZE / 10);
            const offset = Math.max(2, TILE_SIZE / 5);
            
            // Left eye
            ctx.beginPath();
            ctx.arc(
                segment.x * TILE_SIZE + offset,
                segment.y * TILE_SIZE + offset,
                eyeSize, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Right eye
            ctx.beginPath();
            ctx.arc(
                segment.x * TILE_SIZE + TILE_SIZE - offset,
                segment.y * TILE_SIZE + offset,
                eyeSize, 0, Math.PI * 2
            );
            ctx.fill();
        }
    });
}

function endSnakeGame() {
    running = false;
    gameOver = true;
    clearInterval(gameLoop);
    if (snakeFinalScoreElement) snakeFinalScoreElement.textContent = score;
    if (snakeGameOverScreen) snakeGameOverScreen.classList.add('show');
}

function updateSnakeScore() {
    if (snakeScoreElement) snakeScoreElement.textContent = score;
}

function restartSnakeGame() {
    startSnakeGame();
}

// Keyboard controls - Global event listener
document.addEventListener('keydown', (e) => {
    // Only process snake game keys when the game is running
    if (!running) return;
    
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'DOWN') {
                nextDirection = 'UP';
                e.preventDefault();
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'UP') {
                nextDirection = 'DOWN';
                e.preventDefault();
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'RIGHT') {
                nextDirection = 'LEFT';
                e.preventDefault();
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'LEFT') {
                nextDirection = 'RIGHT';
                e.preventDefault();
            }
            break;
        case ' ':
            if (gameOver) {
                restartSnakeGame();
                e.preventDefault();
            }
            break;
    }
});

// Add focus to canvas for better keyboard control
if (snakeCanvas) {
    snakeCanvas.setAttribute('tabindex', '0');
    snakeCanvas.addEventListener('click', () => {
        snakeCanvas.focus();
    });
}