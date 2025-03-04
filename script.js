var map = L.map('map').setView([22.5726, 88.3639], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var taxiIcon = L.icon({
    iconUrl: 'img/taxi.png', // Ensure the image is in an 'img' folder
    iconSize: [50, 50]
});

var routingControl;

// Function to get coordinates of a location using Nominatim API
async function getCoordinates(location) {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    let response = await fetch(url);
    let data = await response.json();
    if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
        alert(`Location not found: ${location}`);
        return null;
    }
}

// Function to search for locations and display route
async function searchLocations() {
    let fromLocation = document.getElementById("from").value;
    let toLocation = document.getElementById("to").value;

    if (!fromLocation || !toLocation) {
        alert("Please enter both source and destination.");
        return;
    }

    let fromCoords = await getCoordinates(fromLocation);
    let toCoords = await getCoordinates(toLocation);

    if (fromCoords && toCoords) {
        if (routingControl) {
            map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(fromCoords[0], fromCoords[1]),
                L.latLng(toCoords[0], toCoords[1])
            ]
        }).addTo(map);
    }
}

// Function to get user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            let currentCoords = [position.coords.latitude, position.coords.longitude];
            L.marker(currentCoords, { icon: taxiIcon }).addTo(map).bindPopup("You are here!").openPopup();
            document.getElementById("from").value = `${currentCoords[0]}, ${currentCoords[1]}`;
        }, function () {
            alert("Location access denied!");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}
