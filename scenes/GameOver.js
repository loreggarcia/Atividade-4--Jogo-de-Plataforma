// Cena 3: Game Over com botão para reiniciar o jogo
class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: "gameover",
    });
  }

  // Pré-carregamento de recursos
  preload() {
    this.load.image("restart", "assets/restart.png"); // Carregando a imagem do botão "play"
    this.load.image("bg3", "assets/bg3.png"); // Carregando a imagem de fundo
  }

  create() {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg3");

    var restartButton = this.add
      .image(400, 500, "restart")
      .setScale(0.35)
      .setInteractive({ cursor: "pointer" });

    // Efeito ao passar o mouse sobre o botão: AUMENTA
    restartButton.on("pointerover", () => {
      restartButton.setScale(0.37);
    });

    // Efeito ao passar o mouse sobre o botão: RETORNA AO TAMANHO ORIGINAL
    restartButton.on("pointerout", () => {
      restartButton.setScale(0.35);
    });

    
    restartButton.on("pointerdown", () => {
      this.scene.stop("gameover"); // Fecha a cena de GameOver
      this.scene.start("game"); // Reinicia a cena 'game'
    });
  }
}
