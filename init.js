(function () {
  document.addEventListener("CharacterCreated", (data) => {
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
      playerCharacterSrc: data.detail.src,
      characterName: data.detail.characterName,
    });
    overworld.init();
  });
})();

function onClockIn() {
  let name = document.getElementById("name").value;
  removeCharacterNamePrompt();
  const characterSelectionScreen = new CharacterSelectionScreen({
    element: document.querySelector(".game-container"),
    characterName: name,
  });
  characterSelectionScreen.init();
}

function removeCharacterNamePrompt() {
  let el = document.getElementById("character-name-container");
  el.style.display = "none";
}
