const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = { x: 100, y: 120, w: 24, h: 24, speed: 4, inCar: false };
const car    = { x: 320, y: 260, w: 48, h: 24, speed: 6 };
const keys = Object.create(null);

const buildings = [
  { x: 180, y: 80,  w: 120, h: 120 },
  { x: 420, y: 320, w: 160, h: 120 },
  { x: 620, y: 140, w: 100, h: 200 }
];

// input
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup',   e => { keys[e.key.toLowerCase()] = false; });

function rectsOverlap(a, b){
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function clampToCanvas(obj){
  if (obj.x < 0) obj.x = 0;
  if (obj.y < 0) obj.y = 0;
  if (obj.x + obj.w > canvas.width)  obj.x = canvas.width  - obj.w;
  if (obj.y + obj.h > canvas.height) obj.y = canvas.height - obj.h;
}

function movePlayer(){
  let dx = 0, dy = 0;
  if (keys['arrowup'] || keys['w']) dy -= player.speed;
  if (keys['arrowdown'] || keys['s']) dy += player.speed;
  if (keys['arrowleft'] || keys['a']) dx -= player.speed;
  if (keys['arrowright'] || keys['d']) dx += player.speed;

  const old = { x: player.x, y: player.y };
  player.x += dx; player.y += dy;
  clampToCanvas(player);

  for (const b of buildings){
    if (rectsOverlap(player, b)){
      player.x = old.x; player.y = old.y;
      break;
    }
  }

  // enter car
  if (keys['e'] && rectsOverlap(player, car)){
    player.inCar = true;
  }
}

function moveCar(){
  if (keys['arrowup'] || keys['w']) car.y -= car.speed;
  if (keys['arrowdown'] || keys['s']) car.y += car.speed;
  if (keys['arrowleft'] || keys['a']) car.x -= car.speed;
  if (keys['arrowright'] || keys['d']) car.x += car.speed;
  clampToCanvas(car);

  // exit car
  if (keys['q']){
    player.inCar = false;
    player.x = Math.min(canvas.width - player.w, car.x + car.w + 4);
    player.y = car.y + (car.h - player.h) / 2;
  }
}

function drawMap(){
  // roads
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 240, canvas.width, 120);   // horizontal road
  ctx.fillRect(360, 0, 80, canvas.height);   // vertical road

  // buildings
  ctx.fillStyle = '#8b5a2b';
  for (const b of buildings) ctx.fillRect(b.x, b.y, b.w, b.h);
}

function drawCar(){
  ctx.fillStyle = 'green';
  ctx.fillRect(car.x, car.y, car.w, car.h);
  // wheels
  ctx.fillRect(car.x+4, car.y-4, 12, 4);
  ctx.fillRect(car.x+car.w-16, car.y-4, 12, 4);
  ctx.fillRect(car.x+4, car.y+car.h, 12, 4);
  ctx.fillRect(car.x+car.w-16, car.y+car.h, 12, 4);
}

function drawPlayer(){
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function loop(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawCar();
  if (player.inCar) { moveCar(); } else { movePlayer(); drawPlayer(); }
  requestAnimationFrame(loop);
}
loop();
