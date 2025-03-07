// Cena 1: Tela inicial com o botão start para iniciar o jogo
class Start extends Phaser.Scene {
  constructor() {
    super({
      key: "start",
    });
  }

  // Pré-carregamento de recursos
  preload() {
    this.load.image("bg", "assets/bg.png"); // Carregando a imagem do botão
    this.load.image("play", "assets/button.png"); // Carregando a imagem do botão "play"
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
    var startButton = this.add
      .image(400, 500, "play")
      .setScale(0.35)
      .setInteractive({ cursor: "pointer" });

    // Efeito ao passar o mouse sobre o botão: AUMENTA
    startButton.on("pointerover", () => {
      startButton.setScale(0.37);
    });

    startButton.on("pointerout", () => {
      startButton.setScale(0.35);
    });

    startButton.on("pointerdown", () => {
      this.scene.start("cutscene"); // Reinicia a cena 'game'
    });
  }
}
