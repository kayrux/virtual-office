class CharacterSelectionScreen {
  constructor(config) {
    this.name = config.name || "Worker 1";
    this.characterFileName = config.characterFileName || "hero.png";
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.characterName = config.characterName || "Bob";

    this.starterCharacters = [
      "/images/characters/people/officeguy.png",
      "/images/characters/people/officelady.png",
    ];

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],
      "walk-down": [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-up": [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      "walk-left": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };

    this.currentAnimation = "idle-down";
    this.currentAnimationFrame = 0;
    this.currentSelectedCharacter = 0;
  }

  init() {
    let prompt = document.querySelector(".character-selection-prompt");
    prompt.style.display = "block";
    const keyHandler = (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.shiftSelection(-1);
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.shiftSelection(1);
      } else if (e.code === "Enter") {
        prompt.style.display = "none";
        utils.emitEvent("CharacterCreated", {
          src: this.starterCharacters[this.currentSelectedCharacter],
          characterName: this.characterName,
        });
        document.removeEventListener("keydown", keyHandler);
      }
    };

    document.addEventListener("keydown", keyHandler);
    this.draw();
  }

  shiftSelection(numShift) {
    if (numShift === -1) {
      if (this.currentSelectedCharacter === 0) {
        this.currentSelectedCharacter = this.starterCharacters.length - 1;
      } else {
        this.currentSelectedCharacter--;
      }
    } else if (numShift === 1) {
      if (this.currentSelectedCharacter === this.starterCharacters.length - 1) {
        this.currentSelectedCharacter = 0;
      } else {
        this.currentSelectedCharacter++;
      }
    }
    this.draw();
  }

  draw() {
    const offsetX = 140;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.starterCharacters.length; i++) {
      if (this.currentSelectedCharacter === i) {
        let spotlight = new Image();
        spotlight.src = "/images/characters/selection-arrow.png";
        spotlight.onload = () => {
          const [frameX, frameY] = this.frame;

          this.ctx.drawImage(
            spotlight,
            frameX * 32,
            frameY * 32,
            32,
            32,
            utils.withGrid(i * 2) + offsetX,
            65,
            32,
            32
          );
        };
      }
      let src = this.starterCharacters[i];
      let image = new Image();
      image.src = src;

      image.onload = () => {
        const [frameX, frameY] = this.frame;

        this.ctx.drawImage(
          image,
          frameX * 32,
          frameY * 32,
          32,
          32,
          utils.withGrid(i * 2) + offsetX,
          70,
          32,
          32
        );
      };
    }
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }
}
