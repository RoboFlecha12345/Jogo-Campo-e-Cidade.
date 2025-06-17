let caminhao;
let pontos = 0;
let estadoDoJogo = "inicio";
let fase = 1;
let obstaculos = [];

let imgCampo;
let imgCidade;
let imgCaminhao;
let somfundo;
let buzina;

function preload() {
  imgCampo = loadImage('hay-bales-644440_1280.jpg');
  imgCidade = loadImage('buildings-1867775_1280.jpg');
  imgCaminhao = loadImage('caminhao.png');
  somfundo = loadSound('fundo.mp3');
  buzina = loadSound('buzina.mp3');
}

function setup() {
  createCanvas(800, 400);
  caminhao = {
    x: 50,
    y: height / 2 - 50,
    w: 120,
    h: 80,
    velocidade: 5
  };
  somfundo.setVolume(0.3);
  somfundo.loop();
  gerarObstaculos();
}

function draw() {
  if (estadoDoJogo === "inicio") {
    telaInicio();
  } else if (estadoDoJogo === "jogando") {
    jogar();
  } else if (estadoDoJogo === "vitoria") {
    telaVitoria();
  }
}

function telaInicio() {
  background(0);
  fill(255);
  textSize(28);
  textAlign(CENTER);
  text("🚚 Leve os alimentos do campo até a cidade!", width / 2, height / 2 - 60);
  textSize(20);
  text("Use as setas para mover o caminhão.", width / 2, height / 2 - 20);
  text("Evite os obstáculos e ganhe pontos!", width / 2, height / 2 + 10);
  text("Aperte ENTER para começar!", width / 2, height / 2 + 50);
}

function jogar() {
  background(220);
  image(imgCampo, 0, 0, width / 2, height);
  image(imgCidade, width / 2, 0, width / 2, height);

  // Obstáculos
  fill(100);
  for (let obs of obstaculos) {
    rect(obs.x, obs.y, obs.w, obs.h);
    if (colidiu(caminhao, obs)) {
      caminhao.x = 50;
      caminhao.y = height / 2 - 50;
    }
  }

  // Caminhão
  image(imgCaminhao, caminhao.x, caminhao.y, caminhao.w, caminhao.h);

  // Movimento
  if (keyIsDown(LEFT_ARROW)) caminhao.x -= caminhao.velocidade;
  if (keyIsDown(RIGHT_ARROW)) caminhao.x += caminhao.velocidade;
  if (keyIsDown(UP_ARROW)) caminhao.y -= caminhao.velocidade;
  if (keyIsDown(DOWN_ARROW)) caminhao.y += caminhao.velocidade;

  caminhao.x = constrain(caminhao.x, 0, width - caminhao.w);
  caminhao.y = constrain(caminhao.y, 0, height - caminhao.h);

  // Chegou na cidade
  if (caminhao.x + caminhao.w >= width) {
    pontos++;
    caminhao.x = 50;
    caminhao.y = height / 2 - 50;

    // Buzina curta e baixa
    if (buzina && buzina.isLoaded()) {
      buzina.setVolume(0.2);
      buzina.play();
      setTimeout(() => {
        buzina.stop();
      }, 400);
    }

    // Mudar de fase
    if (pontos === 15 || pontos === 30) {
      fase++;
      gerarObstaculos();
    }

    // Final do jogo
    if (pontos >= 45) {
      estadoDoJogo = "vitoria";
      somfundo.stop();
    }
  }

  // Texto centralizado
  fill(0);
  textSize(20);
  textAlign(CENTER, TOP);
  text(`Pontos: ${pontos} | Fase: ${fase}`, width / 2, 20);
}

function gerarObstaculos() {
  obstaculos = [];
  let quantidade = 0;
  if (fase === 2) quantidade = 2;
  if (fase === 3) quantidade = 4;

  for (let i = 0; i < quantidade; i++) {
    let obs = {
      x: random(width / 2, width - 100),
      y: random(50, height - 100),
      w: 50,
      h: 50
    };
    obstaculos.push(obs);
  }
}

function colidiu(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function telaVitoria() {
  background(0, 100, 0);
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("🎉 Parabéns!", width / 2, height / 2 - 30);
  textSize(24);
  text("Você completou as 3 fases com 45 pontos!", width / 2, height / 2 + 10);
  text("Aperte R para jogar de novo!", width / 2, height / 2 + 50);
}

function keyPressed() {
  if (estadoDoJogo === "inicio" && keyCode === ENTER) {
    estadoDoJogo = "jogando";
  }

  if (estadoDoJogo === "vitoria" && (key === 'r' || key === 'R')) {
    pontos = 0;
    fase = 1;
    estadoDoJogo = "inicio";
    somfundo.loop();
    gerarObstaculos();
  }
}
