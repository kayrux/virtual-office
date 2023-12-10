function simulateRoomChat() {
    const breakRoomCharacters = Object.entries(characterToLocationMap)
        .filter(([character, location]) => location === "Break Room")
        .map(([character]) => character);

    if (breakRoomCharacters.length >= 3) {
        const conversation = [
            { character: breakRoomCharacters[0], message: "Hey, how's everyone doing?" },
            { character: breakRoomCharacters[1], message: "Doing well, thanks! How about you?" },
            { character: breakRoomCharacters[2], message: "I'm good too, just a bit busy today." },
            // Add more messages as needed
        ];

        appendConversationToChatbox(conversation, "roomChat");
    }
}

function appendConversationToChatbox(conversation, chatboxId) {
    const chatboxContent = document.querySelector('#' + chatboxId + ' .chatbox-content');

    conversation.forEach(({ character, message }) => {
        const messageElement = document.createElement("p");
        messageElement.textContent = character + ": " + message;
        chatboxContent.appendChild(messageElement);
    });
}

// Call this function to start the conversation simulation
simulateRoomChat(); // Uncomment this line to automatically start the simulation on load
