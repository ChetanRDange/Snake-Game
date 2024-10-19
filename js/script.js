// Game constants & variables
let inputdir = { x: 0, y: 0 };
const foodsound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const movesound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
let score = 0;
let speed = 4;
let lastPaintTime = 0;
let snakearr = [{ x: 13, y: 15 }];
food = { x: 6, y: 7 };

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If snake bumps into itself
    for (let i = 1; i < snakearr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // If snake bumps into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

function gameEngine() {
    // Updating the snake array & food
    if (isCollide(snakearr)) {
        gameOverSound.play();
        musicSound.pause();
        inputdir = { x: 0, y: 0 };
        alert("Game over! Press any key to play again!");
        snakearr = [{ x: 13, y: 15 }];
        score = 0;
        musicSound.play();
        scoreBox.innerHTML = "Score: " + score;
        return;
    }

    // If snake eats food
    if (snakearr[0].y === food.y && snakearr[0].x === food.x) {
        foodsound.play();
        score += 1;
        if (score > hiScoreval) {
            hiScoreval = score;
            localStorage.setItem("hiScore", JSON.stringify(hiScoreval));
            hiScoreBox.innerHTML = "HiScore: " + hiScoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakearr.unshift({ x: snakearr[0].x + inputdir.x, y: snakearr[0].y + inputdir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(Math.random() * (b - a)) + a, y: Math.round(Math.random() * (b - a)) + a };
    }

    // Moving the snake
    for (let i = snakearr.length - 2; i >= 0; i--) {
        snakearr[i + 1] = { ...snakearr[i] };
    }
    snakearr[0].x += inputdir.x;
    snakearr[0].y += inputdir.y;

    // Displaying the snake and food
    board.innerHTML = "";
    snakearr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("snake");
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

// Main logic

musicSound.play();
let hiScore = localStorage.getItem("hiScore");
if (hiScore === null) {
    hiScoreval = 0;
    localStorage.setItem("hiScore", JSON.stringify(hiScoreval));
} else {
    hiScoreval = JSON.parse(hiScore);
    hiScoreBox.innerHTML = "HiScore: " + hiScoreval;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", e => {
    inputdir = { x: 0, y: 1 }; // Start the game
    movesound.play();
    switch (e.key) {
        case "ArrowUp":
            inputdir.x = 0;
            inputdir.y = -1;
            break;
        case "ArrowDown":
            inputdir.x = 0;
            inputdir.y = 1;
            break;
        case "ArrowLeft":
            inputdir.x = -1;
            inputdir.y = 0;
            break;
        case "ArrowRight":
            inputdir.x = 1;
            inputdir.y = 0;
            break;
    }
});
