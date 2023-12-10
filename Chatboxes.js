function toggleChat(chatId) {
    var chatboxContent = document.querySelector('#' + chatId + ' .chatbox-content');
    var button = document.querySelector('#' + chatId + ' button');

    if (chatboxContent.classList.contains('show')) {
        chatboxContent.classList.remove('show');
        chatboxContent.classList.add('hide');
        button.textContent = "Open";
    } else {
        chatboxContent.classList.remove('hide');
        chatboxContent.classList.add('show');
        button.textContent = "Close";
    }
}
