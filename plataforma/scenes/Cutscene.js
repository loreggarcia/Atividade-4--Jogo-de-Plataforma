//Cena 2: Cutscene
class CutScene extends Phaser.Scene {
  constructor() {
    super({ key: "cutscene" });
    this.dialogues = [
      //Array com as falas em ordem
      "Que dia terrível! O maldito do Jim congelou todos os meus grampeadores em gelatinas e pra piorar o Michael está irado comigo por ter descoberto que eu incendiei o escritório",
      "Me ajude a pegar as gelatinas e fugir do Michael",
      "Use o teclas direcionais de seu teclado para me guiar e recolher gelatinas",
      "Lembre-se, a cada 12 gelatinas recolhidas um novo Michael aparece para me perseguir (NÃO ENCOSTE NELES OU O JOGO ACABA)",
    ];
    this.maxCharsPerLine = 15; //máximo de caracteres por linha
  }

  preload() {
    this.load.image("bg1", "assets/bg1.png"); //background céu
  }

  create() {
    // Adiciona o fundo
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg1");

    // Inicializa variáveis de controle do diálogo
    this.dialogIndex = 0;
    this.charIndex = 0;
    this.textSpeed = 30; // Velocidade da digitação
    this.isTyping = false;

    // Adiciona o balão de fala após 1s
    this.time.delayedCall(
      1000,
      () => {
        this.createDialogue();
      },
      [],
      this
    );

    // Configura o evento de pressionar a tecla E
    this.input.keyboard.on("keydown", (event) => {
      if (
        event.code === "KeyE" ||
        event.code === "Enter" ||
        event.code === "Space"
      ) {
        this.handleDialogueProgress();
      }
    });
  }

  createDialogue() {
    // Adiciona o balão de fala (estático)
    this.balloon = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "balloon-cutscene"
      )
      .setScale(0.57);

    // Cria o texto com estilo pixel art
    this.dialogText = this.add.text(320, 50, "", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#371b07",
      wordWrap: { width: 480 },
    });

    // Inicia a animação de texto
    this.startTypingEffect(this.dialogues[this.dialogIndex]);
  }

  startTypingEffect(text) {
    this.isTyping = true;
    this.charIndex = 0;
    this.dialogText.setText("");

    // Limpa qualquer timer existente
    if (this.typingTimer) {
      this.typingTimer.remove();
    }

    // Cria um timer para o efeito de máquina de escrever
    this.typingTimer = this.time.addEvent({
      delay: this.textSpeed,
      callback: () => {
        this.charIndex++;
        this.dialogText.setText(text.substring(0, this.charIndex));

        // Verifica se o texto completo foi exibido
        if (this.charIndex >= text.length) {
          this.isTyping = false;
          this.typingTimer.remove();
        }
      },
      repeat: text.length - 1,
    });
  }

  handleDialogueProgress() {
    // Se ainda estiver digitando, completa o texto atual
    if (this.isTyping) {
      this.charIndex = this.dialogues[this.dialogIndex].length;
      this.dialogText.setText(this.dialogues[this.dialogIndex]);
      this.isTyping = false;
      if (this.typingTimer) {
        this.typingTimer.remove();
      }
      return;
    }

    // Avança para o próximo diálogo
    this.dialogIndex++;

    // Verifica se ainda existem diálogos a serem exibidos
    if (this.dialogIndex < this.dialogues.length) {
      this.startTypingEffect(this.dialogues[this.dialogIndex]);
    } else {
      // Finaliza a cena e passa para a próxima
      this.scene.stop("cutscene"); // Fecha a cena de GameOver
      this.scene.start("game"); // Reinicia a cena 'game'
    }
  }
}
