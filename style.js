const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 100, y: 100, size: 20, speed: 4, inCar: false };
let car = { x: 300, y: 260, w: 40, h: 20, speed: 6 };
let keys = {};
let canEnter = true;

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

    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y + player.size < canvas.height) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x + player.size < canvas.width) player.x += player.speed;

    // Collision with buildings
    for (let b of buildings) {
        if (checkCollision(player, b)) {
            player.x = oldX;
            player.y = oldY;
        }
    }

    // Enter car
    if (keys["e"] && checkCollision(player, {x: car.x, y: car.y, w: car.w, h: car.h}) && canEnter) {
        player.inCar = true;
        canEnter = false;
        setTimeout(() => canEnter = true, 300);
    }
}

function moveCar() {
    if (keys["ArrowUp"] && car.y > 0) car.y -= car.speed;
    if (keys["ArrowDown"] && car.y + car.h < canvas.height) car.y += car.speed;
    if (keys["ArrowLeft"] && car.x > 0) car.x -= car.speed;
    if (keys["ArrowRight"] && car.x + car.w < canvas.width) car.x += car.speed;

    // Exit car
    if (keys["q"] && canEnter) {
        player.inCar = false;
        player.x = car.x + car.w + 10;
        player.y = car.y;
        canEnter = false;
        setTimeout(() => canEnter = true, 300);
    }
}

function drawMap() {
    ctx.fillStyle = "gray"; // road
    ctx.fillRect(0, 250, canvas.width, 100);

    ctx.fillStyle = "brown"; // buildings
    for (let b of buildings) {
        ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    ctx.fillStyle = "green"; // car
    ctx.fillRect(car.x, car.y, car.w, car.h);
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
