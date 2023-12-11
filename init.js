(function () {
  const characterSelectionScreen = new CharacterSelectionScreen({
    element: document.querySelector(".game-container"),
  });
  characterSelectionScreen.init();

  document.addEventListener("CharacterCreated", (data) => {
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
      playerCharacterSrc: data.detail.src,
    });
    overworld.init();
  });
})();
