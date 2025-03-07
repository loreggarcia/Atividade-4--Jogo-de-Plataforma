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
    this.load.image("sky", "assets/bg2.png"); //background céu
    this.load.image("computador", "assets/download-removebg-preview.png");
    this.load.image("chao", "assets/platform1234.png"); //chao
    this.load.image("cafe", "assets/platform2.png"); //café
    this.load.image("Jim", "assets/platform1.png"); //Jim
    this.load.image("calculadora", "assets/platform3.png"); //calculadora
    this.load.image("gelatin", "assets/star.png");
    this.load.image("bomb", "assets/Michael.png"); //bombas
    this.load.spritesheet("dwight", "assets/Dwight.png", {
      frameWidth: 117, //largura
      frameHeight: 235, //altura
    });
  }

  create() {
    this.add.image(400, 300, "sky");

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
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(0.35);

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
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
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

    //Se apertar o botão para cima
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330); //vai para cima
    }
  }
  //coletar
  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000); //player fica vermelho

    player.anims.play("turn");

    gameOver = true;
    this.time.delayedCall(1500, () => {
      //Tempo da cena + espera
      if ((gameOver = true)) {
        this.scene.stop("gamer"); // Fecha a cena de GameOver
        this.scene.start("gameover"); // Reinicia a cena 'game'
      }
    });
  }

  collectGelatin(player, gelatin) {
    gelatin.disableBody(true, true);

    score += 10;
    scoreText.setText("Pontuação: " + score);

    // Criando grupo de bombas corretamente
    this.bombs = this.physics.add.group();

    // Colisão entre bombas e plataformas
    this.physics.add.collider(this.bombs, plataforms);
    this.physics.add.collider(player, this.bombs, this.hitBomb, null, this);

    // Função para quando o jogador coletar todas as estrelas
    if (gelatins.countActive(true) === 0) {
      gelatins.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      var bomb = this.bombs.create(x, 16, "bomb"); // Criando bomba dentro do grupo
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.setScale(0.13);
    }
  }
}
