const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Car object
let car = {
  x: 100,
  y: 100,
  width: 60,
  height: 30,
  speed: 5,
  color: "red"
};

// Draw car
function drawCar() {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);

  // Wheels (black circles)
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(car.x + 10, car.y + car.height, 8, 0, Math.PI * 2);
  ctx.arc(car.x + car.width - 10, car.y + car.height, 8, 0, Math.PI * 2);
  ctx.fill();
}

// Update screen
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar();
  requestAnimationFrame(update);
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") car.y -= car.speed;
  if (e.key === "ArrowDown" || e.key === "s") car.y += car.speed;
  if (e.key === "ArrowLeft" || e.key === "a") car.x -= car.speed;
  if (e.key === "ArrowRight" || e.key === "d") car.x += car.speed;
});

update();
