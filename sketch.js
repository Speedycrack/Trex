//Crear estados del Juego END y PLAY
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Segundo estado de juego
var SCORE = 1;
var NOTSCORE = 0;
var gameState2 = NOTSCORE;


//Crear variable de objetos del programa
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;

//Crear variable del puntaje
var score;
var score2;


function preload(){
  //precargar imagen de trex corriendo
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  //precargar imagen de trex colisionando
  trex_collided = loadAnimation("trex_collided.png");
  
  //precargar imagen de suelo
  groundImage = loadImage("ground2.png");
  
  //precargar imagen de nubes
  cloudImage = loadImage("cloud.png");
  
  //precargar imagen de obstaculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //precargar imagen de gameOver y restart
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound= loadSound("die.mp3");
  cpSound = loadSound("checkPoint.mp3");
  
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //crea el sprite de trex
  trex = createSprite(50,height-50,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  //crear radio de Colision al trex
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true;
  
  //crea el sprite de suelo
  ground = createSprite(200,height-50,400,20);
  ground.addImage("ground",groundImage);
  
  //crea el sprite de suelo invisible
  invisibleGround = createSprite(200,height-30,400,20);
  invisibleGround.visible = false;
  
  //crea grupos de obstaculos y de nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //Sprites de GameOver y Restart
  gameOver = createSprite(width/2,height/2-50,400,50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.6;
  
  
  restart = createSprite(width/2,height/2,100,20);
  restart.addImage(restartImg);
  restart.scale = 0.6;
  
  
  //variable de score
  score = 0;
  score2 = 0;
}

function draw() {
  background(170);
  
  //Mostrar la puntuacion
  text("SCORE: " + score, height-150, 50);
 
  //segundo Score
  if(gameState2 === SCORE){
     text("Score 2: " + score2, height-150, 30);
  }
  
  console.log("Estado de juego:  ", gameState);
  
//Condiciones para estado de juego PLAY
  if (gameState === PLAY){
    
    //mover el suelo
      ground.velocityX = -(6+score/100);

      //puntuacion
      score = score + Math.round(getFrameRate()/60);
      
      //sonido de checkpoint
      if (score % 100 === 0 && score>0){
        cpSound.play();
      }
    console.log(frameCount);
    console.log(score);
    
    
      //hacer invisibles gameOver y restart
      gameOver.visible = false;
      restart.visible = false;
    
      //restablecer el suelo
      if (ground.x < 0){
        ground.x = ground.width/2;
      }
    
      //trex salta cuando se presiona la tecla de espacio
      if((keyDown("space")|| touches.lenght>0) && trex.y>=height-90) {
        trex.velocityY = -10;
        touches=[];
        jumpSound.play();
      }
      
      //gravedad del trex
      trex.velocityY = trex.velocityY + 0.8

      //aparece las nubes
      spawnClouds();

      //aparecer los obstaculos
      spawnObstacles();

      //Cambiar estado de juego si trex toca los obstaculos
      if (obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
        
      }
  }  
//Condiciones para estado de juego END  
  else if (gameState === END){
        score2 = score;
      //detener el suelo
      ground.velocityX = 0;

      //detener el salto del trex
      trex.velocityY = 0;

      //detener grupo de nubes y obstaculos
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);

      //cambia la animacion del Trex
      trex.changeAnimation("collided", trex_collided);

      //establece tiempo de vida a los objetos para que nunca sean destruidos.
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

      //Mostrar gameOver y restart
      gameOver.visible = true;
      restart.visible = true;
    }
  
  //evita que el Trex caiga
  trex.collide(invisibleGround);
  
  if (mousePressedOver(restart)){
    reset();
    score=0;
  }
  

  drawSprites();

  
}

function reset(){
  gameState=PLAY;
  gameState2=SCORE;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(width,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(height/8,height/2))
    cloud.scale = 0.6;
    cloud.velocityX = -3;
    cloud.lifetime = width/2 + 20;
    
    //ajusta la profundidad
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    //añade cada nube al grupo
    cloudsGroup.add(cloud);
    }
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
    //aparecer los obstaculos
    obstacle = createSprite(width,height-50,10,40);
    obstacle.velocityX = -(6+score/100);
    
    obstacle.scale = 0.5;
    
    //dar tiempo de vida a los obstaculos
    obstacle.lifetime = 170;
    
    //añade cada obstaculo al grupo
    obstaclesGroup.add(obstacle);
    
    //generar obstaculos al azar
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }
  }
}