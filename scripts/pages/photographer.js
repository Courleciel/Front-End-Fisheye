import photographerTemplate from "../templates/photographer.js";
import mediaFactory from "../factories/MediaFactory.js";

async function fetchData() {
  try {
    const response = await fetch('/data/photographers.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Could not fetch data:', error);
  }
}

function getPhotographerId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function displayPhotographer(photographer) {
  const photographerSection = document.querySelector(".photograph-header");
  const elements = photographerTemplate(photographer).getUserHeader();

  elements.forEach(element => {
    photographerSection.appendChild(element);
  });
}

function displayMedia(mediaArray, photographerName) {
  const mediaContainer = document.querySelector("#mediaContainer");

  mediaArray.forEach(media => {
    const mediaElement = mediaFactory(media, photographerName);
    mediaContainer.appendChild(mediaElement);
  });
}

function displayPhotographerInfo(photographer, mediaArray) {
  const totalLikes = mediaArray.reduce((acc, media) => acc + media.likes, 0);

  const infoContainer = document.getElementById('photographer-info-container');
  infoContainer.innerHTML = `
    <p>${totalLikes} <i class="fa-solid fa-heart"></i></p>
    <p>${photographer.price}€ / jour</p>
  `;
}

async function init() {
  const data = await fetchData();
  const photographerId = getPhotographerId();

  if (data) {
    const photographer = data.photographers.find(p => p.id == photographerId);
    if (photographer) {
      displayPhotographer(photographer);
      const media = data.media.filter(m => m.photographerId == photographerId);
      if (media.length > 0) {
        displayMedia(media, photographer.name);
        displayPhotographerInfo(photographer, media);
      }
    }
  }
}

init();
