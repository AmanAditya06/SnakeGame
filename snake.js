// JavaScript code
const gameContainer = document.getElementById("game-container");
const gameBoard = document.getElementById("game-board");
const pauseIcon = document.getElementById("pause-icon");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const snakeSize = 20;
const boardSize = 400;
const bodyElement = document.body;
const sunElement = document.getElementById("sun-icon");
const moonElement = document.getElementById("moon-icon");
const pauseBtnElement = document.getElementById("btn-pause");
const playBtnElement = document.getElementById("btn-play");
var myElement = document.getElementById('disappointment');
const Music = new Audio("resources/bg-music.mp3");
const Silence = new Audio("resources/silence.mp3");
var bgMusic = Music;
var headphoneElement = document.getElementById('headphone-icon');
let eatFoodSound=new Audio("resources/eat-food.mp3");
let gameOverSound = new Audio("resources/game-over.mp3");
let gameBonusSound = new Audio("resources/game-bonus.mp3");
let snake = [{x: 200, y: 200}];
let direction = "right";
let food = {x: 0, y: 0};
let lastRenderTime = 0;
let speed = 150; // Speed control (milliseconds)
let score = 0;
let highScore = getHighScoreFromLocalStorage(); // Retrieve the high score from local storage
draw();
let isPaused = true;
pauseIcon.style.display = "block";
let pauseKey = " "; // Spacebar key

// Function to retrieve the high score from local storage
function getHighScoreFromLocalStorage() {
const storedHighScore = localStorage.getItem("highScore");
if (storedHighScore) {
    return parseInt(storedHighScore);
}
return 0;
}

// Function to save the high score to local storage
function saveHighScoreToLocalStorage() {
localStorage.setItem("highScore", highScore.toString());
}

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastRenderTime;
    if (isPaused) {
    requestAnimationFrame(gameLoop);
    return;
    }
    
    if (deltaTime < speed) {
    requestAnimationFrame(gameLoop);
    return;
    }
    bgMusic.play();
    speed+=0.1;
    highScore = getHighScoreFromLocalStorage(); // Retrieve the high score from local storage
    lastRenderTime = currentTime;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    updateSnake();
    checkCollision();
    checkFoodCollision();
}

function draw() {
    gameBoard.innerHTML = "";
    
    snake.forEach((dot) => {
    const snakeDot = createDot(dot.x, dot.y, "snake-dot");
    gameBoard.appendChild(snakeDot);
    });
    
    const foodDot = createDot(food.x, food.y, "food-dot");
    gameBoard.appendChild(foodDot);
}

function updateSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    if (direction === "right") {
    head.x += snakeSize;
    } else if (direction === "left") {
    head.x -= snakeSize;
    } else if (direction === "up") {
    head.y -= snakeSize;
    } else if (direction === "down") {
    head.y += snakeSize;
    }
    
    snake.unshift(head);
    
    if (!checkFoodCollision()) {
    snake.pop();
    }
}

function checkFoodCollision() {
    const head = snake[0];
    
    if (head.x === food.x && head.y === food.y) {
    eatFoodSound.play();
    score++;
    speed-=(speed/(150+score))*score;
    updateScore();
    generateFood();
    return true;
    }
    
    return false;
}

function generateFood() {
    const maxX = boardSize - snakeSize;
    const maxY = boardSize - snakeSize;
    food.x = Math.floor(Math.random() * maxX / snakeSize) * snakeSize;
    food.y = Math.floor(Math.random() * maxY / snakeSize) * snakeSize;
}

function checkCollision() {
    const head = snake[0];
    
    if (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize
    ) {
    gameOverSound.play();
    gameOver();
    return;
    }
    
    for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOverSound.play();
        gameOver();
        return;
    }
    }
}

function gameOver() {
    isGameOver = true;
    speed=150;
if (score > highScore) {
    highScore = score;
    updateHighScore();
    celebrate();
} else {
    disappoint();
    pauseIcon.style.display = "block";
    isPaused=true;
    snake = [{x: 200, y: 200}];
    direction = "right";
    generateFood();
    score = 0;
    updateScore();
    playBtnElement.style.display="flex";
    pauseBtnElement.style.display="none";
    bgMusic.pause();
}
}

function celebrate() {
    gameBonusSound.play();
    const celebration = document.createElement("div");
    celebration.textContent = "Congratulations!New High Score!";
    celebration.classList.add("celebration");
    gameContainer.appendChild(celebration);

    setTimeout(() => {
        celebration.classList.remove("celebration");
        celebration.remove();
    }, 3000);
}

function disappoint(){
    var myElement = document.getElementById('disappointment');
    var finalScore = document.getElementById('finalscore');
    if (myElement) {
        myElement.style.display='flex';
        finalScore.textContent = "Score: " + `${score}`;
    }
}

function createDot(x, y, className) {
    const dot = document.createElement("div");
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    dot.className = className;
    return dot;
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateHighScore() {
highScoreElement.textContent = highScore;
saveHighScoreToLocalStorage(); // Save the high score to local storage
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight" && direction !== "left") {
    direction = "right";
    } else if (event.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
    } else if (event.key === "ArrowUp" && direction !== "down") {
    direction = "up";
    } else if (event.key === "ArrowDown" && direction !== "up") {
    direction = "down";
    } else if (event.key === pauseKey) {
    togglePause();
    }
});

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
    pauseIcon.style.display = "flex";
    playBtnElement.style.display="flex";
    pauseBtnElement.style.display="none";
    bgMusic.pause();
    } else {
    pauseIcon.style.display = "none";
    pauseBtnElement.style.display="flex";
    playBtnElement.style.display="none";
    myElement.style.display='none';
    bgMusic.play();
    requestAnimationFrame(gameLoop);
    }
}

generateFood();
updateScore();
updateHighScore();
requestAnimationFrame(gameLoop);

sunElement.addEventListener('click', function(){
    bodyElement.style.backgroundColor='white';
    sunElement.style.display='none';
    moonElement.style.display='block';
});

moonElement.addEventListener('click', function() {
    bodyElement.style.backgroundColor='black';
    moonElement.style.display='none';
    sunElement.style.display='block';
});


document.getElementById("btn-up").addEventListener("click", function(){
    if (direction !== "down") {
        direction = "up";
    }
});
document.getElementById("btn-down").addEventListener("click",function(){
    if (direction !== "up") {
        direction = "down";
    }
});
document.getElementById("btn-left").addEventListener("click", function(){
    if (direction !== "right") {
        direction = "left";
    }
});
document.getElementById("btn-right").addEventListener("click", function(){
    if (direction !== "left") {
        direction = "right";
    }
});

pauseBtnElement.addEventListener('click', function(){
    isPaused=true;
    bgMusic.pause();
    pauseIcon.style.display = "flex";
    playBtnElement.style.display="flex";
    pauseBtnElement.style.display="none";
})

playBtnElement.addEventListener('click', function(){
    isPaused=false;
    bgMusic.play();
    pauseIcon.style.display = "none";
    pauseBtnElement.style.display="flex";
    playBtnElement.style.display="none";
})

document.getElementById('btn-replay').addEventListener('click', function(){
    myElement.style.display='none';
})
var c=1;
headphoneElement.addEventListener('click', function(){
    if(c===1){
        headphoneElement.style.color='grey';
        bgMusic=Silence;
        bgMusic.pause();
        c=2;
    }
    else{
        headphoneElement.style.color='blue';
        bgMusic=Music;
        c=1;
    }

})