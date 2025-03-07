// Cena 1: Tela inicial com o botão start para iniciar o jogo
class Start extends Phaser.Scene {
  constructor() {
    super({
      key: "start", //idemtificador da cena
    });
  }

  // Pré-carregamento de recursos
  preload() {
    this.load.image("bg", "assets/bg.png"); // Carregando a imagem do fundo
    this.load.image("play", "assets/button.png"); // Carregando a imagem do botão "play"
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg"); //Centraliza a imagem de fundo na tela
    var startButton = this.add //configuração do botão play e adição de uma variável a ele 
      .image(400, 500, "play") 
      .setScale(0.35)
      .setInteractive({ cursor: "pointer" }); //permite interação com o mouse e altera o cursor para um ponteiro.

    // Efeito ao passar o mouse sobre o botão: AUMENTA
    startButton.on("pointerover", () => {
      startButton.setScale(0.38);
    });
    
    // Efeito ao retirar o mouse do botão: RETORNA AO VALOR ORIGINAL
    startButton.on("pointerout", () => {
      startButton.setScale(0.35);
    });

    // Efeito ao retirar o mouse do botão: RETORNA AO VALOR ORIGINAL
    startButton.on("pointerdown", () => {
      this.scene.start("cutscene"); // Inicia a cena 'Cutscene'
    });
  }
}
