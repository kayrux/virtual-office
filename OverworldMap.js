class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    if (this.upperImage) {
      ctx.drawImage(
        this.upperImage,
        utils.withGrid(10.5) - cameraPerson.x,
        utils.withGrid(6) - cameraPerson.y
      );
    }
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying) {
      const targetElement = document.querySelector("body");
      if (
        match &&
        match.talking.length &&
        document.activeElement === targetElement
      ) {
        this.startCutscene(match.talking[0].events);
      }

      if (
        match &&
        match.availableToChat &&
        document.activeElement === targetElement
      ) {
        utils.emitEvent("InitiateNewChat", match.name);
      }
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.PlayerName = "John";

window.OverworldMaps = {
  Hallway: {
    lowerSrc: "/images/maps/Hallway.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(6),
        y: utils.withGrid(11),
        name: "John",
      }),
      npcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(9),
        name: "Mia",
        availableToChat: true,
        src: "/images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 1800 },
          { type: "stand", direction: "down", time: 2800 },
          { type: "stand", direction: "right", time: 1800 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 2800 },
          { type: "stand", direction: "left", time: 1800 },
          { type: "stand", direction: "down", time: 1800 },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
            ],
          },
        ],
      }),
      // npcB: new Person({
      //   x: utils.withGrid(5),
      //   y: utils.withGrid(7),
      //   name: "Tony",
      //   availableToChat: true,
      //   src: "/images/characters/people/npc2.png",
      //   behaviorLoop: [
      //     { type: "stand", direction: "down", time: 1000 },
      //     { type: "stand", direction: "right", time: 800 },
      //     { type: "stand", direction: "up", time: 1900 },
      //     { type: "stand", direction: "left", time: 1900 },

      //     { type: "walk", direction: "left" },
      //     { type: "walk", direction: "up" },
      //     { type: "walk", direction: "right" },
      //     { type: "walk", direction: "down" },

      //   ],
      //   talking: [
      //     {
      //       events: [
      //         { type: "textMessage", text: "Damm! Where is my access card???", faceHero: "npcB" },
      //       ],
      //     },
      //   ],
      // }),
      // npcC: new Person({
      //   x: utils.withGrid(11),
      //   y: utils.withGrid(6),
      //   name: "Joe",
      //   availableToChat: true,
      //   src: "/images/characters/people/npc3.png",
      //   behaviorLoop: [
      //     { type: "stand", direction: "down", time: 9000 },
      //     { type: "stand", direction: "left", time: 9300 },
      //     { type: "stand", direction: "right", time: 9000 },
      //     { type: "walk", direction: "down" },
      //     { type: "walk", direction: "down" },
      //     { type: "walk", direction: "down" },
      //     { type: "walk", direction: "down" },
      //     { type: "stand", direction: "up", time: 10000 },
      //     { type: "stand", direction: "left", time: 3000 },
      //     { type: "stand", direction: "down", time: 9000 },
      //     { type: "walk", direction: "up" },
      //     { type: "walk", direction: "up" },
      //     { type: "walk", direction: "up" },
      //     { type: "walk", direction: "up" },
      //   ],
      //   talking: [
      //     {
      //       events: [
      //         { type: "textMessage", text: "Lovely coffee time~~~~~", faceHero: "npcC" },
      //       ],
      //     },
      //   ],
      // }),
    },
    walls: {
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(3, 2)]: true,
      [utils.asGridCoord(4, 3)]: true,
      [utils.asGridCoord(5, 2)]: true,
      [utils.asGridCoord(6, 3)]: true,
      [utils.asGridCoord(7, 2)]: true,
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(9, 4)]: true,
      [utils.asGridCoord(10, 4)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(12, 4)]: true,
      [utils.asGridCoord(13, 5)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(13, 7)]: true,
      [utils.asGridCoord(13, 8)]: true,
      [utils.asGridCoord(13, 9)]: true,
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(12, 12)]: true,
      [utils.asGridCoord(11, 12)]: true,
      [utils.asGridCoord(10, 12)]: true,
      [utils.asGridCoord(9, 12)]: true,
      [utils.asGridCoord(8, 12)]: true,
      [utils.asGridCoord(7, 12)]: true,
      [utils.asGridCoord(6, 13)]: true,
      [utils.asGridCoord(5, 12)]: true,
      [utils.asGridCoord(4, 12)]: true,
      [utils.asGridCoord(3, 12)]: true,
      [utils.asGridCoord(2, 12)]: true,
      [utils.asGridCoord(1, 12)]: true,
      [utils.asGridCoord(0, 11)]: true,
      [utils.asGridCoord(0, 10)]: true,
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(0, 3)]: true,
      [utils.asGridCoord(0, 2)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 12)]: [
        {
          events: [{ type: "changeMap", map: "Blank" }],
        },
      ],
      [utils.asGridCoord(5, 3)]: [
        {
          events: [{ type: "changeMap", map: "Meeting Room" }],
        },
      ],
      [utils.asGridCoord(3, 3)]: [
        {
          events: [{ type: "changeMap", map: "Office" }],
        },
      ],
      [utils.asGridCoord(7, 3)]: [
        {
          events: [{ type: "changeMap", map: "Break Room" }],
        },
      ],
    },
  },
  "Meeting Room": {
    lowerSrc: "/images/maps/MeetingRoom.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(6),
        y: utils.withGrid(11),
        name: "",
      }),
      npcD: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(5),
        name: "Lisa",
        availableToChat: true,
        src: "/images/characters/people/npc4.png",
        behaviorLoop: [
          { type: "stand", direction: "right", time: 7000 },
          { type: "stand", direction: "down", time: 7000 },
          { type: "stand", direction: "right", time: 3000 },
          { type: "stand", direction: "down", time: 3000 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Hi, Bob, let's schedule a meeting to discuss this project.",
                faceHero: "npcD",
              },
            ],
          },
        ],
      }),
      npcE: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(7),
        name: "Daniel",
        availableToChat: true,
        src: "/images/characters/people/npc5.png",
        behaviorLoop: [
          { type: "stand", direction: "up", time: 9000 },
          { type: "stand", direction: "right", time: 3000 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I will make this suggestion during our team briefing this afternoon.",
                faceHero: "npcE",
              },
            ],
          },
        ],
      }),
      npcH: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        name: "Fiona",
        availableToChat: true,
        src: "/images/characters/people/npc8.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 9000 },
          { type: "stand", direction: "down", time: 3000 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Ensure all data is verified and updated.",
                faceHero: "npcH",
              },
            ],
          },
        ],
      }),
    },
    walls: {
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(3, 3)]: true,
      [utils.asGridCoord(4, 3)]: true,
      [utils.asGridCoord(5, 3)]: true,
      [utils.asGridCoord(6, 3)]: true,
      [utils.asGridCoord(7, 3)]: true,
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(9, 3)]: true,
      [utils.asGridCoord(10, 3)]: true,
      [utils.asGridCoord(11, 3)]: true,
      [utils.asGridCoord(12, 3)]: true,
      [utils.asGridCoord(13, 4)]: true,
      [utils.asGridCoord(13, 5)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(13, 7)]: true,
      [utils.asGridCoord(13, 8)]: true,
      [utils.asGridCoord(13, 9)]: true,
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(12, 12)]: true,
      [utils.asGridCoord(11, 12)]: true,
      [utils.asGridCoord(10, 12)]: true,
      [utils.asGridCoord(9, 12)]: true,
      [utils.asGridCoord(8, 12)]: true,
      [utils.asGridCoord(7, 12)]: true,
      [utils.asGridCoord(6, 13)]: true,
      [utils.asGridCoord(5, 12)]: true,
      [utils.asGridCoord(4, 12)]: true,
      [utils.asGridCoord(3, 12)]: true,
      [utils.asGridCoord(2, 12)]: true,
      [utils.asGridCoord(1, 12)]: true,
      [utils.asGridCoord(0, 11)]: true,
      [utils.asGridCoord(0, 10)]: true,
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(0, 3)]: true,
      [utils.asGridCoord(0, 2)]: true,
      // Table
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(6, 6)]: true,
      [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(6, 8)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(7, 5)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(7, 8)]: true,
      [utils.asGridCoord(7, 9)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 12)]: [
        {
          events: [{ type: "changeMap", map: "Hallway" }],
        },
      ],
    },
  },
  Office: {
    lowerSrc: "/images/maps/Office.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(6),
        y: utils.withGrid(11),
        name: "",
      }),
      npcA: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(6),
        name: "Bob",
        availableToChat: true,
        src: "/images/characters/people/npc2.png",
        behaviorLoop: [{ type: "stand", direction: "left", time: 2000 }],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Stop bothering me...",
                faceHero: "npcA",
              },
            ],
          },
        ],
      }),
      npcF: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(6),
        name: "Anna",
        availableToChat: true,
        src: "/images/characters/people/npc4.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 10000 },
          { type: "stand", direction: "down", time: 2000 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "We need to update our project plan.",
                faceHero: "npcF",
              },
            ],
          },
        ],
      }),
      npcG: new Person({
        x: utils.withGrid(4),
        y: utils.withGrid(8),
        name: "George",
        availableToChat: true,
        src: "/images/characters/people/npc8.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 9000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "down", time: 3000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 9000 },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "We need to update our project plan.",
                faceHero: "npcG",
              },
            ],
          },
        ],
      }),
    },
    walls: {
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(3, 3)]: true,
      [utils.asGridCoord(4, 3)]: true,
      [utils.asGridCoord(5, 3)]: true,
      [utils.asGridCoord(6, 3)]: true,
      [utils.asGridCoord(7, 3)]: true,
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(9, 4)]: true,
      [utils.asGridCoord(10, 4)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(12, 4)]: true,
      [utils.asGridCoord(13, 5)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(13, 7)]: true,
      [utils.asGridCoord(13, 8)]: true,
      [utils.asGridCoord(13, 9)]: true,
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(12, 12)]: true,
      [utils.asGridCoord(11, 12)]: true,
      [utils.asGridCoord(10, 12)]: true,
      [utils.asGridCoord(9, 12)]: true,
      [utils.asGridCoord(8, 12)]: true,
      [utils.asGridCoord(7, 12)]: true,
      [utils.asGridCoord(6, 13)]: true,
      [utils.asGridCoord(5, 12)]: true,
      [utils.asGridCoord(4, 12)]: true,
      [utils.asGridCoord(3, 12)]: true,
      [utils.asGridCoord(2, 12)]: true,
      [utils.asGridCoord(1, 12)]: true,
      [utils.asGridCoord(0, 11)]: true,
      [utils.asGridCoord(0, 10)]: true,
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(0, 3)]: true,
      [utils.asGridCoord(0, 2)]: true,
      // Tables
      [utils.asGridCoord(3, 6)]: true,
      [utils.asGridCoord(3, 8)]: true,
      [utils.asGridCoord(3, 10)]: true,
      [utils.asGridCoord(9, 6)]: true,
      [utils.asGridCoord(9, 8)]: true,
      [utils.asGridCoord(9, 10)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 12)]: [
        {
          events: [{ type: "changeMap", map: "Hallway" }],
        },
      ],
    },
  },
  "Break Room": {
    lowerSrc: "/images/maps/BreakRoom.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(6),
        y: utils.withGrid(11),
        name: "",
      }),
      npcA: new Person({
        x: utils.withGrid(1),
        y: utils.withGrid(6),
        src: "/images/characters/people/npc1.png",
        name: "Elsa",
        availableToChat: true,
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Im having lunch. Want to try some?",
                faceHero: "npcA",
              },
            ],
          },
        ],
        behaviorLoop: [{ type: "stand", direction: "right", time: 9000 }],
      }),
      npcB: new Person({
        x: utils.withGrid(11),
        y: utils.withGrid(7),
        src: "/images/characters/people/npc3.png",
        name: "Chris",
        availableToChat: true,
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Wanna play?!",
                faceHero: "npcB",
              },
            ],
          },
        ],
        behaviorLoop: [{ type: "stand", direction: "left", time: 9000 }],
      }),
      npcC: new Person({
        x: utils.withGrid(2),
        y: utils.withGrid(4),
        src: "/images/characters/people/npc2.png",
        name: "Harry",
        availableToChat: true,
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I can't decide what to get from the vending machine...",
                faceHero: "npcC",
              },
            ],
          },
        ],
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 12)]: [
        {
          events: [{ type: "changeMap", map: "Hallway" }],
        },
      ],
    },
    walls: {
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(3, 3)]: true,
      [utils.asGridCoord(4, 3)]: true,
      [utils.asGridCoord(5, 3)]: true,
      [utils.asGridCoord(6, 3)]: true,
      [utils.asGridCoord(7, 3)]: true,
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(9, 4)]: true,
      [utils.asGridCoord(10, 4)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(12, 4)]: true,
      [utils.asGridCoord(13, 5)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(13, 7)]: true,
      [utils.asGridCoord(13, 8)]: true,
      [utils.asGridCoord(13, 9)]: true,
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(12, 12)]: true,
      [utils.asGridCoord(11, 12)]: true,
      [utils.asGridCoord(10, 12)]: true,
      [utils.asGridCoord(9, 12)]: true,
      [utils.asGridCoord(8, 12)]: true,
      [utils.asGridCoord(7, 12)]: true,
      [utils.asGridCoord(6, 13)]: true,
      [utils.asGridCoord(5, 12)]: true,
      [utils.asGridCoord(4, 12)]: true,
      [utils.asGridCoord(3, 12)]: true,
      [utils.asGridCoord(2, 12)]: true,
      [utils.asGridCoord(1, 12)]: true,
      [utils.asGridCoord(0, 11)]: true,
      [utils.asGridCoord(0, 10)]: true,
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(0, 6)]: true,
      [utils.asGridCoord(0, 5)]: true,
      [utils.asGridCoord(0, 4)]: true,
      [utils.asGridCoord(0, 3)]: true,
      [utils.asGridCoord(0, 2)]: true,
      //Ping pong table
      [utils.asGridCoord(9, 7)]: true,
      [utils.asGridCoord(10, 7)]: true,
      //Tables
      [utils.asGridCoord(2, 6)]: true,
      [utils.asGridCoord(2, 8)]: true,
      [utils.asGridCoord(2, 10)]: true,
    },
  },
  Blank: {
    lowerSrc: "/images/maps/Blank.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        name: "Bob",
      }),
    },
  },
};

// DemoRoom: {
//   lowerSrc: "/images/maps/MeetingRoom.png",
//   upperSrc: "",
//   gameObjects: {
//     hero: new Person({
//       isPlayerControlled: true,
//       x: utils.withGrid(5),
//       y: utils.withGrid(6),
//       name: "Bob",
//     }),
//     npcA: new Person({
//       x: utils.withGrid(7),
//       y: utils.withGrid(9),
//       name: "Lisa",
//       availableToChat: true,
//       src: "/images/characters/people/npc1.png",
//       behaviorLoop: [
//         { type: "stand", direction: "left", time: 800 },
//         { type: "stand", direction: "up", time: 800 },
//         { type: "stand", direction: "right", time: 1200 },
//         { type: "stand", direction: "up", time: 300 },
//       ],
//       // talking: [
//       //   {
//       //     events: [
//       //       { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
//       //     ],
//       //   },
//       // ],
//     }),
//     npcB: new Person({
//       x: utils.withGrid(8),
//       y: utils.withGrid(5),
//       name: "Harry",
//       src: "/images/characters/people/officeguy.png",
//       // behaviorLoop: [
//       //   { type: "walk",  direction: "left" },
//       //   { type: "stand",  direction: "up", time: 800 },
//       //   { type: "walk",  direction: "up" },
//       //   { type: "walk",  direction: "right" },
//       //   { type: "walk",  direction: "down" },
//       // ]
//     }),
//   },
//   walls: {
//     [utils.asGridCoord(7, 6)]: true,
//     [utils.asGridCoord(8, 6)]: true,
//     [utils.asGridCoord(7, 7)]: true,
//     [utils.asGridCoord(8, 7)]: true,
//   },
//   cutsceneSpaces: {
//     // [utils.asGridCoord(7, 4)]: [
//     //   {
//     //     events: [
//     //       { who: "npcB", type: "walk", direction: "left" },
//     //       { who: "npcB", type: "stand", direction: "up", time: 500 },
//     //       { type: "textMessage", text: "You can't be in there!" },
//     //       { who: "npcB", type: "walk", direction: "right" },
//     //       { who: "hero", type: "walk", direction: "down" },
//     //       { who: "hero", type: "walk", direction: "left" },
//     //     ],
//     //   },
//     // ],
//     [utils.asGridCoord(5, 10)]: [
//       {
//         events: [{ type: "changeMap", map: "Break Room" }],
//       },
//     ],
//   },
// },
