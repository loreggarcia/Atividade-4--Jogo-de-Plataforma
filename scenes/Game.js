//Cena 2: Jogo de plataforma
var plataforms; //variavel que guardará a posição das plataformas
var score = 0;
var scoreText;
var player;
var cursors;
var gelatins;
var gameOver;

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.cursors = null;
    this.bombs = null;
  }

  preload() {
    //carregando as imagens
    this.load.image("bg2", "assets/bg2.png"); 
    //obstáculos
    this.load.image("computador", "assets/download-removebg-preview.png");
    this.load.image("chao", "assets/platform1234.png"); 
    this.load.image("cafe", "assets/platform2.png"); 
    this.load.image("Jim", "assets/platform1.png"); 
    this.load.image("calculadora", "assets/platform3.png");
    //Item coletável 
    this.load.image("gelatin", "assets/star.png");
    //Vilão
    this.load.image("bomba", "assets/Michael.png"); 
    //Sprite de Dwight
    this.load.spritesheet("dwight", "assets/Dwight.png", {
      frameWidth: 117, //largura da sprite
      frameHeight: 235, //altura da sprite
    });
  }

  create() {
    //adicionando fundo
    this.add.image(400, 300, "bg2");

    //plataforma
    plataforms = this.physics.add.staticGroup(); //mantém estatico o objeto plataforma
    //posições das plataformas
    plataforms.create(400, 568, "chao").setScale(2).refreshBody();
    plataforms.create(600, 410, "computador").setScale(0.25).refreshBody();
    plataforms.create(100, 250, "cafe").setScale(0.25).refreshBody();
    plataforms.create(700, 250, "cafe").setScale(0.25).refreshBody();
    plataforms.create(400, 200, "Jim").setScale(0.7).refreshBody();
    plataforms.create(300, 300, "calculadora").setScale(0.15).refreshBody();
    plataforms.create(500, 300, "calculadora").setScale(0.15).refreshBody();
    plataforms.create(200, 410, "computador").setScale(0.25).refreshBody();

    //player
    player = this.physics.add.sprite(100, 450, "dwight");
    player.setBounce(0.2); //Efeito de quique
    player.setCollideWorldBounds(true); //Não pode sair da tela
    player.setScale(0.35);
    player.body.setSize(100,200) //Ajusta a hitbox

    //personagem vai para a esquerda
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dwight", {
        start: 0,
        end: 3,
      }), //usa os frames 0,1,2,3
      frameRate: 10, //10 dos frames por segundo
      repeat: -1, //deixa em loop
    });

    //personagem fica de frente
    this.anims.create({
      key: "turn",
      frames: [{ key: "dwight", frame: 4 }], //usa frame 4
      frameRate: 20,
    });

    //personagem vai para direita
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dwight", {
        start: 5,
        end: 8,
      }), //usa os frames 5,6,7,8
      frameRate: 10, //usa 10 dos frames por segundo
      repeat: -1, //deixa em loop
    });

    //adiciona uma relação de colisão entre 2 objetos: jogador e plataforma
    this.physics.add.collider(player, plataforms);

    //a variavel guardará as informações do cursor do teclado
    cursors = this.input.keyboard.createCursorKeys();

    //estrela
    gelatins = this.physics.add.group({
      key: "gelatin",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    gelatins.children.iterate(function (child) {
      child.setScale(0.15);
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); //efeito de quique
      child.body.setSize(100,200) //ajuste da hitbox
    });
     
    /* NOTA: Overlap e Collider:
    Collider: Aplica a colisão
    Overlap: Detecta a sobreposição*/

    //adiciona uma relação de colisão entre 2 objetos: jogador e plataforma
    this.physics.add.collider(gelatins, plataforms);
    //verificar se o player encostou na estrela
    this.physics.add.overlap(player, gelatins, this.collectGelatin, null, this);

    //bomba
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, plataforms);
    this.physics.add.collider(player, this.bombs, this.hitBomb, null, this);
    //placar
    scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    //função para caso o jogador pegue uma bomba
  }

  update() {
    //Se apertar o botão para esquerda (<-)
    if (cursors.left.isDown) {
      player.setVelocityX(-160); //anda para esquerda na velocidade 160
      player.anims.play("left", true); //anima os sprites da chave 'left'
    }
    //Se apertar o botão para direita (->)
    else if (cursors.right.isDown) {
      player.setVelocityX(160); //anda para direita na velocidade 160
      player.anims.play("right", true); //anima os sprites da chave 'right'
    }

    //Caso nenhum dos dois for apertado, o personagem fica de frente
    else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    //Se o personagem estiver no chão e apertar o botão para cima o personagem pula 
    if (cursors.up.isDown && player.body.touching.down) { 
      player.setVelocityY(-330); //vai para cima
    }
  }

  collectGelatin(player, gelatin) {
    gelatin.disableBody(true, true); //desativa o corpo da gelatina e torna ela invisível(desapaece do jogo)

    //Pontuação
    score += 1;
    scoreText.setText("Pontuação: " + score);

    // Criando grupo de bombas 
    this.bombs = this.physics.add.group();

    // Colisão entre bombas e plataformas
    this.physics.add.collider(this.bombs, plataforms);
    this.physics.add.collider(player, this.bombs, this.hitBomb, null, this);

    // Se todas as gelatinas forem coletadas:
    if (gelatins.countActive(true) === 0) {
      gelatins.children.iterate(function (child) {
    // Reativa a física, estabelece nova posição da gelatina, garante que gelatina fique vísivel e ativa novamente
        child.enableBody(true, child.x, 0, true, true); //reinicia gelatina
      });


      var x =
        player.x < 400 //Se jogador estiver a esquerda (400 = Centro da tela no eixo x)
          ? Phaser.Math.Between(400, 800) //Entre 400 e 800(DIREITA)
          : Phaser.Math.Between(0, 400); //Entre 0 e 400(ESQUERDA)
        // Criando bomba dentro do grupo  
      var bomb = this.bombs.create(x, 16, "bomb"); 
      bomb.body.setSize(150,150)
      bomb.setBounce(1); //coeficiente de quique 
      bomb.setCollideWorldBounds(true);//não pode sair da tela
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); //velocidade no eixo x(ida e volta), velocidade eixo y(descida)
      bomb.setScale(0.13);
    }
  }

  //Se o personagem colidir com uma bomba:  
  hitBomb(player, bomb) {
    this.physics.pause(); //Jogo pausa

    player.setTint(0xff0000); //Jogador fica vermelho

    player.anims.play("turn"); //Jogador fica de frente

    gameOver = true;
    this.time.delayedCall(1500, () => {
      //Tempo da cena + espera
      if ((gameOver = true)) {
        this.scene.start("gameover"); // Inicia a cena 'gameover'
      }
    });
  }
}
