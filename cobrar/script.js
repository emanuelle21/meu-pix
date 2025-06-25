const lampada = document.getElementById("lampada");
const container = document.getElementById("container");
const canvas = document.getElementById("corda");
const ctx = canvas.getContext("2d");
const puxador = document.getElementById("puxador");
const som = document.getElementById("somClique");

let puxando = false;
let puxada = 200;
const alturaMin = 200;
const alturaMax = 600;
const cordaSegmentos = 50;
const pontos = new Array(cordaSegmentos).fill(0).map(() => ({ y: 0, vy: 0 }));

function desenharCorda() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(3, 0);
  for (let i = 0; i < cordaSegmentos; i++) {
    ctx.lineTo(3, pontos[i].y);
  }
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 6;
  ctx.stroke();
}

function animar() {
  for (let i = 0; i < cordaSegmentos; i++) {
    const targetY = (i / cordaSegmentos) * puxada;
    const ponto = pontos[i];
    const dy = targetY - ponto.y;
    ponto.vy += dy * 0.1;
    ponto.vy *= 0.85;
    ponto.y += ponto.vy;
  }

  puxador.style.top = (pontos[cordaSegmentos - 1].y + 180 - 40) + "px";
  canvas.height = pontos[cordaSegmentos - 1].y + 100;
  desenharCorda();
  requestAnimationFrame(animar);
}

function iniciarPuxada(y) {
  puxando = true;
}

function moverPuxada(y) {
  if (puxando) {
    const distancia = Math.min(alturaMax, Math.max(alturaMin, y - canvas.getBoundingClientRect().top));
    puxada = distancia;
  }
}

function soltar() {
  if (puxando) {
    puxando = false;
    puxada = alturaMin;
    lampada.classList.toggle("ligada");
    container.classList.toggle("ligada");
    if (som) som.play();
  }
}

puxador.addEventListener("mousedown", (e) => iniciarPuxada(e.clientY));
document.addEventListener("mousemove", (e) => moverPuxada(e.clientY));
document.addEventListener("mouseup", soltar);

puxador.addEventListener("touchstart", (e) => {
  e.preventDefault();
  iniciarPuxada(e.touches[0].clientY);
}, { passive: false });

document.addEventListener("touchmove", (e) => {
  e.preventDefault();
  moverPuxada(e.touches[0].clientY);
}, { passive: false });

document.addEventListener("touchend", soltar);

animar();
