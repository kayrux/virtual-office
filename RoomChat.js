const conversation = [
  "{A}: Good morning, {B}, {C}, and {D}! Ready for another productive day?",
  "{B}: Morning, {A}! Absolutely, just wrapping up the report from yesterday.",
  "{C}: Hi all! Just got in. {A}, do we have a team meeting scheduled today?",
  //"{D}: Good morning, everyone! Excited for today's challenges.",
  "{A}: Yes, {C}. It's right after lunch. Hoping to finalize our project plan.",
  "{B}: Sounds good. I'll review the plan before the meeting.",
  "{C}: Great! I've got updates on the client feedback as well.",
  //"{D}: I'll bring the latest analytics for us to look over in the meeting.",
  "{A}: Excellent, we'll need that. {B}, how's the budget looking?",
  "{B}: Almost done. Need your input on a few items, {A}.",
  "{C}: Speaking of budget, I have some ideas for cost optimization.",
  //"{D}: That's a good focus, {C}. I've noticed a few areas we could improve.",
  "{A}: That's great to hear, {C} and {D}! Let's discuss more in the meeting.",
  "{B}: Will do. Also, are we still on for the conference next week?",
  "{C}: Yes, got our passes and schedule ready. It's going to be insightful.",
  //"{D}: I'm really looking forward to the conference. It's a great learning opportunity.",
  "{A}: Perfect. We should plan our agenda for the conference soon.",
  "{B}: Agreed. Need to make the most out of it.",
  "{C}: I'll draft an initial agenda and share it with you all.",
  //"{D}: I can help with the presentation materials for the conference.",
  "{A}: Thanks, {C} and {D}. How about we grab a coffee later and go over it?",
  "{B}: Sounds good, {A}. Could use a coffee break.",
  "{C}: Count me in! See you both at 11 then?",
  //"{D}: I'll join as well. The break will be a nice change of pace.",
  "{A}: Yes, let's meet at the usual spot.",
  "{B}: Great, see you then!",
  "{C}: Have you guys heard about the new software update?",
  //"{D}: I was just reading about it this morning. Seems like a significant upgrade.",
  "{A}: Not yet, {C}. What's new in this update?",
  "{B}: I heard it’s supposed to enhance our data security.",
  "{C}: Exactly, and it adds new features to our analytics tool.",
  //"{D}: The update will help us streamline our data processing.",
  "{A}: That’s great news. We should schedule the update soon.",
  "{B}: Agreed. I’ll check the system compatibility.",
  "{C}: Also, we need to train the team on the new features.",
  //"{D}: I can organize a training session for next week.",
  "{A}: Good point, {C} and {D}. Let's plan a training session next week.",
  "{B}: I’ll prepare the training materials.",
  "{C}: I can assist with the technical aspects.",
  //"{D}: And I'll coordinate with the IT department to ensure a smooth rollout.",
  "{A}: Perfect, teamwork at its best!",
  "{B}: How's everyone's workload for this week?",
  "{C}: Quite packed, I have three client meetings lined up.",
  //"{D}: My schedule is tight, but manageable. Working on the new project proposal.",
  "{A}: Mine's manageable. Focused on the new marketing campaign.",
  "{B}: I’ll need help with the budget analysis, {A}.",
  "{C}: I can pitch in if you need an extra hand, {B}.",
  //"{D}: Let me know if you need any data for that, {B}.",
  "{A}: Thanks, {C} and {D}. We should balance the workload efficiently.",
  "{B}: Absolutely. Let’s catch up later for planning.",
  "{C}: By the way, the office is planning a team outing next month.",
  //"{D}: That's exciting! I love team outings.",
  "{A}: That’s a great idea. Where are we heading?",
  "{B}: I heard it might be a beach retreat.",
  "{C}: Sounds relaxing. We all could use a break.",
  //"{D}: Beach retreat sounds amazing. I'm definitely in.",
  "{A}: Definitely. It’ll be a good team bonding opportunity.",
  "{B}: I agree. Looking forward to it.",
  "{C}: Let's make sure all major projects are on track before then.",
  //"{D}: Good thinking, {C}. We don't want to leave any loose ends.",
  "{A}: Right. We don’t want work piling up while we’re away.",
  "{B}: True. Let's prioritize our tasks accordingly.",
  "{C}: I’ll update the project timeline today.",
  //"{D}: And I'll assist with project management to keep things on track.",
  "{A}: Thanks, {C} and {D}. Let’s ensure everything runs smoothly.",
  "{B}: I’ll oversee the ongoing projects.",
  "{C}: And I’ll handle the client communications.",
  //"{D}: I'll support wherever needed. Team, let's keep up the good work!",
  "{A}: Team, we’ve got a busy day ahead. Let’s do our best!",
  "{B}: Agreed. Let's meet later to sync up.",
  "{C}: See you both in the meeting room at 2 PM.",
  //"{D}: Looking forward to it. Have a great day, everyone!"
];

function loadConversationAutomatically(room) {
  if (room === "Hallway") {
    return; // Do not proceed if the room is 'Hallway'
  }

  const chatboxId = "roomChat";
  const userCharacterName = "Thao";
  const roomCharacters = Object.entries(characterToLocationMap)
    .filter(([character, location]) => location === room)
    .map(([character]) => character)
    .slice(0, 3);

  let formattedData = conversation.map((line) =>
    line
      .replace(/{A}/g, roomCharacters[0])
      .replace(/{B}/g, roomCharacters[1])
      .replace(/{C}/g, roomCharacters[2])
      .replace(/{D}/g, userCharacterName)
  );

  appendConversationToChatbox(formattedData, chatboxId);
}

function appendConversationToChatbox(lines, chatboxId) {
  const chatboxContent = document.querySelector(
    "#" + chatboxId + " .chatbox-content"
  );
  chatboxContent.innerHTML = "";

  lines.forEach((line, index) => {
    setTimeout(() => {
      const messageElement = document.createElement("p");
      messageElement.textContent = line;
      chatboxContent.appendChild(messageElement);

      // Scroll to the bottom of the chatbox
      chatboxContent.scrollTop = chatboxContent.scrollHeight;
    }, index * 4000);
  });
}

function sendRoomChatMessage() {
  const userCharacterName = window.PlayerName;
  const inputElement = document.getElementById("roomChatMessage");
  const message = inputElement.value.trim();

  if (message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = userCharacterName + ": " + message;
    const chatboxContent = document.querySelector("#roomChat .chatbox-content");
    chatboxContent.appendChild(messageElement);
    inputElement.value = "";

    // Scroll to the bottom of the chatbox to show the latest message
    chatboxContent.scrollTop = chatboxContent.scrollHeight;
  }
}

// Add event listener for the send button
document
  .getElementById("sendRoomChatButton")
  .addEventListener("click", sendRoomChatMessage);

document
  .getElementById("roomChatMessage")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      sendRoomChatMessage();
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    loadConversationAutomatically("Office");
  }, 60000); // Delay for 1 minute
});
