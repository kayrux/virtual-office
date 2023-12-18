class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.playerCharacterSrc = config.playerCharacterSrc || "";
    this.characterName = config.characterName;
  }

  gameLoopStepWork(delta) {
    //Clear off the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Establish the camera person
    const cameraPerson = this.map.gameObjects.hero;

    //Update all objects
    Object.values(this.map.gameObjects).forEach((object) => {
      object.update({
        delta,
        arrow: this.directionInput.direction,
        map: this.map,
      });
    });

    //Draw Lower layer
    this.map.drawLowerImage(this.ctx, cameraPerson);

    //Draw Game Objects
    Object.values(this.map.gameObjects)
      .sort((a, b) => {
        return a.y - b.y;
      })
      .forEach((object) => {
        object.sprite.draw(this.ctx, cameraPerson);
      });

    //Draw Upper layer
    this.map.drawUpperImage(this.ctx, cameraPerson);
  }

  startGameLoop() {
    let previousMs;
    const step = 1 / 60;

    const stepFn = (timestampMs) => {
      if (this.map.isPaused) {
        return;
      }

      if (previousMs === undefined) {
        previousMs = timestampMs;
      }
      let delta = (timestampMs - previousMs) / 1000;
      while (delta >= step) {
        this.gameLoopStepWork(delta);
        delta -= step;
      }
      previousMs = timestampMs - delta * 1000;
      requestAnimationFrame(stepFn);
    };
    requestAnimationFrame(stepFn);
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapKey) {
    if (mapKey === "Blank") {
      return;
    }
    const mapConfig = window.OverworldMaps[mapKey];
    this.resetFloatingNames();

    // Set player avatar to the selected character
    if (this.playerCharacterSrc) {
      mapConfig.gameObjects.hero.sprite.image["src"] = this.playerCharacterSrc;
    }

    // Set character name
    if (this.characterName) {
      window.characterName = this.characterName;

      mapConfig.gameObjects.hero.sprite.name = this.characterName;
    }
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    utils.emitEvent("UpdateMap", {
      map: mapKey,
      name: this.characterName,
    });

    this.map.mountObjects();
  }

  resetFloatingNames() {
    // Clear all floating name divs from the document
    const gameContainer = document.querySelector(".game-container");

    let floatingNameElement = document.querySelector(".floating-person-name");
    while (floatingNameElement) {
      gameContainer.removeChild(floatingNameElement);
      floatingNameElement = document.querySelector(".floating-person-name");
    }
  }

  init() {
    window.PlayerName = this.characterName;
    this.startMap("Hallway");

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
    this.map.startCutscene([
      { who: "hero", type: "stand", direction: "up" },
      { type: "textMessage", text: "Time to work!" },
      { who: "hero", type: "walk", direction: "up" },
      { who: "hero", type: "walk", direction: "up" },
    ]);
  }
}
