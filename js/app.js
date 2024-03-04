const clientID = "f7b8c811a6a34230ad7ca86c6be8cdbc";
const clientSecret = "509f9579f366473ba6c24a5536ea5703";

let accessToken = "";

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientID + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  accessToken = data.access_token;
}

document.addEventListener("DOMContentLoaded", function () {
  getAllArtists();
});

document.getElementById("artistInput").addEventListener("input", searchArtists);

async function getAllArtists() {
  if (!accessToken) {
    await getAccessToken();
  }

  const response = await fetch(
    "https://api.spotify.com/v1/artists?ids=2CIMQHirSU0MQqyYHq0eOx%2C57dN52uHvrHOxijzpIgu3E%2C1vCWHaC5f2uS3yhpwWbIA6%2C6wH6iStAh4KIaWfuhf0NYM%2C0EmeFodog0BfCgMzAIvKQp",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const data = await response.json();
  const artistResults = document.getElementById("artistResults");
  artistResults.innerHTML = "";
  data.artists.forEach((artist) => {
    const artistElement = document.createElement("div");

    const artistImage = document.createElement("img");
    artistImage.src = artist.images[0]
      ? artist.images[0].url
      : "https://via.placeholder.com/150";
    artistImage.alt = artist.name;
    artistImage.addEventListener("click", function () {
      window.open(artist.external_urls.spotify, "_blank");
    });
    artistElement.appendChild(artistImage);

    const artistName = document.createElement("div");
    artistName.textContent = artist.name;
    artistElement.appendChild(artistName);

    artistResults.appendChild(artistElement);
  });
}

async function searchArtists() {
  if (!accessToken) {
    await getAccessToken();
  }

  const artistInput = document.getElementById("artistInput").value.trim();
  let searchQuery = "type=artist";

  if (artistInput !== "") {
    searchQuery = `q=${artistInput}&type=artist`;
  } else {
    searchQuery = "";
    getAllArtists();
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?${searchQuery}`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const data = await response.json();

  if(artistInput === '') {
    getAllArtists();
  } else {
    displayResults(data.artists.items);
  }
}

async function searchTracks(artistId) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  const data = await response.json();
  displayTracks(data.tracks);
}

function displayResults(artists) {
  const artistResults = document.getElementById("artistResults");
  artistResults.innerHTML = "";
  artists.forEach((artist) => {
    const artistElement = document.createElement("div");

    const artistImage = document.createElement("img");
    artistImage.src = artist.images[0]
      ? artist.images[0].url
      : "https://via.placeholder.com/150";
    artistImage.alt = artist.name;
    artistElement.appendChild(artistImage);

    artistImage.addEventListener("click", function () {
      window.open(artist.external_urls.spotify, "_blank");
    });

    const artistName = document.createElement("div");
    artistName.textContent = artist.name;
    artistElement.appendChild(artistName);

    artistResults.appendChild(artistElement);
  });
}

function displayTracks(tracks) {
  const tracksResults = document.getElementById("tracksResults");
  tracksResults.innerHTML = "";
  tracks.forEach((track) => {
    const trackElement = document.createElement("div");
    const imgElement = document.createElement("img");
    imgElement.src = track.album.images[0].url;
    trackElement.appendChild(imgElement);
    tracksResults.appendChild(trackElement);
  });
}
