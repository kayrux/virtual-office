function simulateRoomChat(room) {
    // Fetch characters based on the specified room
    const roomCharacters = Object.entries(characterToLocationMap)
        .filter(([character, location]) => location === room)
        .map(([character]) => character);

    if (roomCharacters.length >= 3) {
        // Generate a conversation between the first three characters in the room
        const conversation = [
            { character: roomCharacters[0], message: "Hey, how's everyone doing in the " + room + "?" },
            { character: roomCharacters[1], message: "Doing well, thanks! Any new updates?" },
            { character: roomCharacters[2], message: "Just working on the usual tasks." },
        ];

        appendConversationToChatbox(conversation, "roomChat");
    }
}

function appendConversationToChatbox(conversation, chatboxId) {
    const chatboxContent = document.querySelector('#' + chatboxId + ' .chatbox-content');
    chatboxContent.innerHTML = ''; 

    conversation.forEach(({ character, message }) => {
        const messageElement = document.createElement("p");
        messageElement.textContent = character + ": " + message;
        chatboxContent.appendChild(messageElement);
    });
}

// Example usage
simulateRoomChat("Office"); // Call this with the desired room