const characterToLocationMap = {
    Anna: "Office",
    Bob: "Office",
    Chris: "Break Room",
    Daniel: "Meeting Room",
    Elsa: "Break Room",
    Fiona: "Meeting Room",
    George: "Office",
    Harry: "Break Room",
    Lisa: "Meeting Room",
};

function displayStatus() {
    const locations = {
        "Office": [],
        "Meeting Room": [],
        "Break Room": []
    };

    for (const [character, location] of Object.entries(characterToLocationMap)) {
        locations[location].push(character);
    }

    // Creating HTML content for each location
    let content = `<div class="status-columns">`;
    for (const [location, characters] of Object.entries(locations)) {
        content += `<div class="location-column">
                        <h2>${location}:</h2>
                        <ul>`;
        for (const character of characters) {
            content += `<li>${character}</li>`;
        }
        content += `   </ul>
                    </div>`;
    }
    content += `</div>`;

    // Setting HTML content to the container
    document.querySelector('.characters-status-container').innerHTML = content;
}

// Call the function to display the status
document.addEventListener('DOMContentLoaded', displayStatus);