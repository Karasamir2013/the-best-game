body {
    text-align: center;
    background-color: lightblue;
    font-family: Arial, sans-serif;
}

canvas {
    border: 2px solid black;
    background-color: #eee;
}  
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 100, y: 100, size: 20, speed: 4, inCar: false };
let car = { x: 300, y: 260, w: 40, h: 20, speed: 6 };
let keys = {};

let buildings = [
    { x: 200, y: 100, w: 100, h: 100 },
    { x: 400, y: 300, w: 150, h: 120 },
    { x: 600, y: 150, w: 100, h: 200 }
];

document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

function checkCollision(obj, rect) {
    return obj.x < rect.x + rect.w &&
           obj.x + obj.size > rect.x &&
           obj.y < rect.y + rect.h &&
           obj.y + obj.size > rect.y;
}

function movePlayer() {
    let oldX = player.x;
    let oldY = player.y;

    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    // Collision with buildings
    for (let b of buildings) {
        if (checkCollision(player, b)) {
            player.x = oldX;
            player.y = oldY;
        }
    }

    // Enter car
    if (keys["e"] && checkCollision(player, {x: car.x, y: car.y, w: car.w, h: car.h})) {
        player.inCar = true;
    }
}

function moveCar() {
    if (keys["ArrowUp"]) car.y -= car.speed;
    if (keys["ArrowDown"]) car.y += car.speed;
    if (keys["ArrowLeft"]) car.x -= car.speed;
    if (keys["ArrowRight"]) car.x += car.speed;

    // Exit car
    if (keys["q"]) {
        player.inCar = false;
        player.x = car.x + 50;
        player.y = car.y;
    }
}

function drawMap() {
    ctx.fillStyle = "gray"; // road
    ctx.fillRect(0, 250, canvas.width, 100);

    ctx.fillStyle = "brown"; // buildings
    for (let b of buildings) {
        ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    ctx.fillStyle = "green";
    ctx.fillRect(car.x, car.y, car.w, car.h); // car
}

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    if (player.inCar) {
        moveCar();
    } else {
        movePlayer();
        drawPlayer();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
