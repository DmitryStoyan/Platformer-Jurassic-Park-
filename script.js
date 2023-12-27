let game = new Game();

let stage = new Stage();
stage.backgroundColor = "skyblue";

//дорога
let ground = new Sprite();
ground.addCostume("./images/ground.png");
ground.y = stage.height;
ground.layer = 3;

// игрок
let player = new Sprite();
player.addCostume("./images/p1.png");
player.addCostume("./images/p2.png");
player.addCostume("./images/p3.png");
player.addCostume("./images/p4.png");
player.addCostume("./images/p5.png");
player.addCostume("./images/p6.png");
player.addCostume("./images/p7.png");
player.addCostume("./images/p8.png");
player.addCostume("./images/p9.png");
player.addCostume("./images/p10.png");
player.y = 350;
player.x = 400;
player.size = 80;
player.layer = 5;

// динозавр
let dino = new Sprite();
dino.addCostume("./images/d1.png");
dino.addCostume("./images/d2.png");
dino.addCostume("./images/d3.png");
dino.addCostume("./images/d4.png");
dino.addCostume("./images/d5.png");
dino.addCostume("./images/d6.png");
dino.size = 90;
dino.y = stage.height - 190;
dino.x = 105;
dino.layer = 6;

// забор
let fence = new Sprite();
fence.addCostume("./images/fence.png");
fence.addCostume("./images/fence-drop.png");
fence.size = 40;
fence.layer = 4;
fence.y = stage.height - 175;
fence.hidden = true;

// деревья
let tree = new Sprite();
tree.addCostume("./images/tree.png");
tree.y = stage.height - 235;
tree.hidden = true;
tree.layer = 2;

// кусты
let bush = new Sprite();
bush.addCostume("./images/bush.png");
bush.size = 65;
bush.y = stage.height - 200;
bush.hidden = true;
bush.layer = 1;

// облако
let cloud = new Sprite();
cloud.addCostume("./images/cloud.png");
cloud.size = 60;
cloud.y = stage.height - 350;
cloud.hidden = true;
bush.layer = 1;

// экран проигрыша
let gameOver = new Sprite();
gameOver.addCostume("./images/gameOver.png");
gameOver.hidden = true;

// переменная прыжка
let isJump = false;
// переменная скорости по y
let ySpeed = 0;
// переменная очков
let score = 0;
// определяет запущенна ли игра
let isGame = true;

//игровой процесс
function playerCycle() {
  if (isGame == false) {
    return false;
  }

  // обработка касания экрана для прыжка
  document.addEventListener("touchstart", function (event) {
    if (player.touchSprite(ground) && isJump === false) {
      ySpeed = -16;
      isJump = true;
      console.log("!!!!");
    }
    console.log("11111");
    ySpeed = -16;
    isJump = true;
  });

  // когда игрок стоит на земле он может прыгнуть
  if (player.touchSprite(ground)) {
    ySpeed = -0.8;
    isJump = false;
  }

  // когда мы нажимаем пробел, то можно прыгнуть
  if (game.keyPressed("space") && isJump == false) {
    ySpeed = -16;
    isJump = true;
  }

  ySpeed += 0.8;
  player.y += ySpeed;

  // условие проигрыша
  if (player.touchSprite(dino)) {
    isGame = false;
    player.hidden = true;
    gameOver.hidden = false;
  }
}

// бег игрока
function playerAnimation() {
  player.nextCostume();
}

// бег динозавра
function dinoAnimation() {
  dino.nextCostume();
}

// запуск заборов
function fenceCycle() {
  if (game.getRandom(0, 10) > 3) {
    let fenceClone = fence.createClone();
    fenceClone.x = stage.width + 50;
    fenceClone.hidden = false;

    stage.forever(function () {
      fenceClone.x -= 5;

      // если касается игрока то игрок замедляется
      if (fenceClone.touchSprite(player)) {
        player.x -= 5;
      }

      // если забор касается динозавра то ломается
      if (fenceClone.touchSprite(dino)) {
        fenceClone.switchCostume(1);
      }

      // удаление забора
      if (fenceClone.x < 0) {
        fenceClone.delete();

        if (isGame == true) {
          score += 1;
        }
      }
    });
  }
}

// кусты
function bushCycle() {
  if (game.getRandom(0, 1) == 0) {
    let bushClone = bush.createClone();
    bushClone.x = stage.width + 50;
    bushClone.hidden = false;

    // движение клонов
    bushClone.forever(function () {
      bushClone.x -= 2;

      // удаляем деревья
      if (bushClone.x < -150) {
        bushClone.delete();
      }
    });
  }
}

//Бонусные второстепенные объекты (облака и деревья)
//запуск движения деревьев клонов
function treeCycle() {
  if (game.getRandom(0, 2) == 0) {
    let treeClone = tree.createClone();
    treeClone.x = stage.width + 50;
    treeClone.hidden = false;

    // движение клонов
    treeClone.forever(function () {
      treeClone.x -= 3;
      // удаляем деревья
      if (treeClone.x < -150) {
        treeClone.delete();
      }
    });
  }
}

// движение облаков
function cloudCycle() {
  if (game.getRandom(0, 1) == 0) {
    let cloudClone = cloud.createClone();
    cloudClone.size = game.getRandom(25, 50);
    cloudClone.x = stage.width + 50;
    cloudClone.y = game.getRandom(50, stage.height - 400);
    cloudClone.hidden = false;

    // скорость облаков зависит от их размера
    cloudClone.forever(function () {
      cloudClone.x -= cloudClone.size / 15;

      // удаляем облака
      if (cloudClone.x < -150) {
        cloudClone.delete();
      }
    });
  }
}

// Вывод очков
function drawScore(context) {
  context.font = "bold 50px Arial";
  context.fillStyle = "#212121";
  context.fillText(score, 50, stage.height - 50);
}

stage.forever(playerCycle);
stage.forever(playerAnimation, 50);
stage.forever(dinoAnimation, 100);
stage.forever(fenceCycle, 700);
stage.forever(bushCycle, 2000);
stage.forever(treeCycle, 1500);
stage.forever(cloudCycle, 1000);
stage.pen(drawScore, 7);

game.run();

let button = document.querySelector(".button");
// Установка
let defaultInstallEvent = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  defaultInstallEvent = event;
});
button.addEventListener("click", (event) => {
  defaultInstallEvent.prompt();
});
