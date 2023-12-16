const officeConversation = [
  "{A}: Morning everyone! How are we doing with the current projects?",
  "{B}: Hi {A}, I'm on track with the marketing analysis. Should be ready by this afternoon.",
  "{C}: Good morning! I'm a bit behind on the quarterly report, could use some help.",
  //"{D}: Hey team, I'll be available to assist after I finish the client presentation.",
  "{A}: Great to hear, {B}. {C}, let's see if we can delegate some tasks to balance the workload.",
  "{B}: I can take a look at part of the report, {C}. Just send me the details.",
  "{C}: Thanks, {B}! That would be really helpful.",
  //"{D}: I can review the final draft later today, {C}. Just let me know.",
  "{A}: Remember, we have a team meeting at 3 PM to discuss our progress.",
  "{B}: Got it, I'll prepare a brief summary of my analysis for the meeting.",
  "{C}: I'll make sure to have an update on the report status by then.",
  //"{D}: I'll share the feedback from the client presentation as well.",
  "{A}: Also, there's a new update for our project management software. Make sure to install it today.",
  "{B}: Will do. I heard it has some useful new features.",
  "{C}: I'll install it after finishing my part of the report.",
  //"{D}: Already installed it. The new interface looks clean and user-friendly.",
  "{A}: One last thing, we need to prepare for the upcoming audit. Let's be proactive about it.",
  "{B}: I'll start compiling the necessary financial documents.",
  "{C}: And I'll double-check our compliance reports.",
  //"{D}: I'll assist with organizing the files and data for the audit.",
  "{A}: Thanks, team. Let's keep up the good work and stay focused.",
  "{B}: Absolutely. Let's make this a productive day.",
  "{C}: Agreed. Let's get things done!",
  //"{D}: Here's to a successful day ahead!"
];

const meetingRoomConversation = [
  "{A}: Alright everyone, let's start this meeting. First, let's go over the status of Project X.",
  "{B}: I have the latest numbers. We're on track with the development timeline, but we're over budget.",
  "{C}: The overage is mainly due to the unexpected licensing fees we encountered last month.",
  //"{D}: I've reviewed the budget. We can reallocate some funds from the marketing budget to cover it.",
  "{A}: Good work on that, {D}. Next, let's discuss the client feedback from our latest product launch.",
  "{B}: The feedback has been mostly positive, but there are concerns about the user interface.",
  "{C}: I suggest we schedule a meeting with the design team to discuss potential improvements.",
  //"{D}: Agreed. I'll set up the meeting for next week and include the key points from the feedback.",
  "{A}: Moving on, we need to finalize our plans for the upcoming trade show. Who's leading that?",
  "{B}: That would be me. I've already booked our space and started preparing the product demos.",
  "{C}: I'll help with the promotional materials and make sure our social media is updated.",
  //"{D}: And I'll coordinate with the logistics team to ensure everything is transported safely.",
  "{A}: Excellent teamwork. Lastly, let's talk about our goals for the next quarter.",
  "{B}: One of our main goals should be increasing customer engagement on our platform.",
  "{C}: We also need to focus on improving our product based on the recent user feedback.",
  //"{D}: I think a push towards more data-driven decision making should be another goal for us.",
  "{A}: Great input, everyone. Before we wrap up, any other points or updates?",
  "{B}: Just a reminder, the deadline for the annual report submissions is next Friday.",
  "{C}: I'll need some data from each department for the sustainability section of the report.",
  //"{D}: I'll compile the data and send it to you by Wednesday, {C}.",
  "{A}: Thanks, everyone, for the productive discussion. Let's reconvene next week, same time.",
  "{B}: Sounds good. See you all next week.",
  "{C}: Have a great day, everyone!",
  //"{D}: Looking forward to seeing the progress we make by next week!"
];

const breakRoomConversation = [
  "{A}: Hey everyone, how's your day going so far?",
  "{B}: Not too bad, just finished a big part of my project. How about you?",
  "{C}: Pretty good. I’m looking forward to the weekend though.",
  //"{D}: Yeah, same here. Planning to catch up on some reading.",
  "{A}: Did anyone catch the game last night?",
  "{B}: I missed it. Who won?",
  "{C}: Our team did! It was a really close match, super exciting.",
  //"{D}: I saw the highlights. That last-minute goal was amazing.",
  "{A}: Oh, by the way, have you guys tried the new coffee machine?",
  "{B}: Yes, I have. The espresso it makes is really strong!",
  "{C}: I haven’t yet. I’ll probably give it a try during my next break.",
  //"{D}: I like it. It's definitely an upgrade from the old one.",
  "{A}: Changing topics, is anyone doing anything fun this weekend?",
  "{B}: I'm going hiking. The weather is supposed to be great.",
  "{C}: Sounds nice. I'm just planning a quiet weekend at home.",
  //"{D}: I might go to the movies. There's a new sci-fi film out.",
  "{A}: That sounds like a good mix of plans. Oh, and don't forget about the team lunch next week.",
  "{B}: Right, I'm looking forward to trying that new Italian place.",
  "{C}: Me too! I've heard their pasta dishes are fantastic.",
  //"{D}: I’m just excited about the free food, to be honest!",
  "{A}: Alright, I should head back. Got a report to finish.",
  "{B}: Yeah, me too. Let’s catch up again later.",
  "{C}: See you around, everyone!",
  //"{D}: Have a good one, everyone. Back to work, I guess."
];

function loadConversationAutomatically(room) {
  if (room === "Hallway") {
    chatboxContent.innerHTML = ""; // Clear the chatbox if the room is 'Hallway'
    return;
  }

  const chatboxId = "roomChat";
  const userCharacterName = window.PlayerName;
  const roomCharacters = Object.entries(characterToLocationMap)
    .filter(([character, location]) => location === room)
    .map(([character]) => character)
    .slice(0, 3);

  let selectedConversation;
  switch (room) {
    case 'Meeting Room':
      selectedConversation = meetingRoomConversation;
      break;
    case 'Office':
      selectedConversation = officeConversation;
      break;
    case 'Break Room':
      selectedConversation = breakRoomConversation;
      break;
    default:
      return; 
  }

  let formattedData = selectedConversation.map((line) =>
    line
      .replace(/{A}/g, roomCharacters[0])
      .replace(/{B}/g, roomCharacters[1])
      .replace(/{C}/g, roomCharacters[2])
      .replace(/{D}/g, userCharacterName)
  );

  appendConversationToChatbox(formattedData, chatboxId);
}

// Store the timeout IDs
let messageTimeouts = [];

function appendConversationToChatbox(lines, chatboxId) {
  const chatboxContent = document.querySelector("#" + chatboxId + " .chatbox-content");
  chatboxContent.innerHTML = "";

  // Clear existing timeouts
  messageTimeouts.forEach(timeout => clearTimeout(timeout));
  messageTimeouts = [];

  lines.forEach((line, index) => {
    const timeoutId = setTimeout(() => {
      const messageElement = document.createElement("p");
      messageElement.textContent = line;
      chatboxContent.appendChild(messageElement);
      chatboxContent.scrollTop = chatboxContent.scrollHeight;
    }, index * 4000);

    // Store the timeout ID
    messageTimeouts.push(timeoutId);
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

document.addEventListener("UpdateMap", (data) => {
  let roomChatTitle = document.querySelector(".chatbox-header");
  roomChatTitle.innerHTML = data.detail.map + " Chat";
  // Delay for 1s

  setTimeout(() => {
    loadConversationAutomatically(data.detail.map);
  }, 1000);
});
