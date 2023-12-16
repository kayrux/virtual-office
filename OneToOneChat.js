// Define the one-to-one conversation
const oneToOneConversation = [
  "{E}: Hey there! How's your day going?",
  "{E}: That's good to hear. What are you working on today?",
  "{E}: Oh, interesting! How do you feel about that project?",
  "{E}: It sounds challenging but rewarding. Do you have any plans for the weekend?",
  "{E}: That sounds fun! I was thinking of going hiking.",
  "{E}: Absolutely, nature is always refreshing. Do you hike often?",
  "{E}: It's a great hobby. By the way, have you seen any good movies lately?",
  "{E}: I've heard about that one, it's on my watchlist. What did you like about it?",
  "{E}: Sounds like my kind of movie. I'll have to check it out!",
  "{E}: Switching topics, are you into any sports?",
  "{E}: Nice! Playing or watching?",
  "{E}: That's awesome! It's important to stay active.",
  "{E}: True, true. Speaking of which, I need to get back to my work. Chat later?",
  "{E}: Great talking to you! Have a good one!",
  "{E}: Have you been to any new restaurants lately?",
  "{E}: Oh, I'm always looking for new places to try. Any recommendations?",
  "{E}: That sounds delicious! I'll have to give it a try.",
  "{E}: On a different note, do you have any favorite music artists?",
  "{E}: I love them too! Have you been to any of their concerts?",
  "{E}: Concerts are such a great experience. There's nothing like live music.",
  "{E}: Speaking of live events, have you attended any sports games recently?",
  "{E}: That must have been exciting! Live games always have such a great atmosphere.",
  "{E}: By the way, are you into video games or board games?",
  "{E}: I'm a big fan of board games myself. Do you have a favorite?",
  "{E}: That's a great choice! I love the strategy involved in that one.",
  "{E}: Have you taken any interesting trips recently, or planning any?",
  "{E}: Traveling is always such an enriching experience. Any dream destinations?",
  "{E}: That sounds amazing. I hope you get to go there soon!",
  "{E}: It's been great chatting, but I should probably get back to work.",
  "{E}: Before I go, any book or movie recommendations?",
  "{E}: Thanks for the suggestion! I'll definitely check it out.",
  "{E}: Alright, I've got to head out. Let's chat again soon!",
  "{E}: Take care and have a fantastic day!",
  "{E}: Bye for now!",
];

let oneToOneIndex = 0;
let otherCharacterName = "";

function loadOneToOneMessage() {
  if (oneToOneIndex < oneToOneConversation.length) {
    const chatboxContent = document.querySelector(
      "#oneToOneChat .oneToOne-content"
    );
    const messageElement = document.createElement("p");
    messageElement.textContent = oneToOneConversation[oneToOneIndex].replace(
      /{E}/g,
      otherCharacterName
    );
    chatboxContent.appendChild(messageElement);
    chatboxContent.scrollTop = chatboxContent.scrollHeight;
    oneToOneIndex++;
  }
}

function sendOneToOneChatMessage() {
  const userCharacterName = window.PlayerName;
  const inputElement = document.getElementById("oneToOneChatMessage");
  const message = inputElement.value.trim();

  if (message) {
    const chatboxContent = document.querySelector(
      "#oneToOneChat .oneToOne-content"
    );
    const messageElement = document.createElement("p");
    messageElement.textContent = userCharacterName + ": " + message;
    chatboxContent.appendChild(messageElement);
    inputElement.value = "";
    chatboxContent.scrollTop = chatboxContent.scrollHeight;

    setTimeout(() => {
      loadOneToOneMessage();
    }, 1000);
  }
}

function startChat(newCharacterName) {
  otherCharacterName = newCharacterName;
  resetChat();
  // Update the header of the chatbox
  const chatHeader = document.querySelector("#oneToOneChat .oneToOne-header");
  if (chatHeader) {
    chatHeader.textContent = newCharacterName;
  }

  // Update the otherCharacterName for the chat messages
  if (newCharacterName) {
    document
      .getElementById("oneToOneChatMessage")
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          sendOneToOneChatMessage();
        }
      });

    document
      .getElementById("sendOneToOneChatButton")
      .addEventListener("click", function () {
        sendOneToOneChatMessage();
      });
  }
}
function resetChat() {
  const chatHeader = document.querySelector("#oneToOneChat .oneToOne-header");
  if (chatHeader) {
    chatHeader.textContent = "";
  }

  const chatboxContent = document.querySelector(
    "#oneToOneChat .oneToOne-content"
  );
  chatboxContent.innerHTML = "";
}

document
  .getElementById("sendOneToOneChatButton")
  .addEventListener("onclick", sendOneToOneChatMessage);

document.addEventListener("InitiateNewChat", (data) => {
  startChat(data.detail);
});
document.addEventListener("UpdateMap", () => {
  resetChat();
});
