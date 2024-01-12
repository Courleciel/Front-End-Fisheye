import photographerTemplate from "../templates/photographer.js";
import mediaFactory from "../factories/MediaFactory.js";

let currentIndex = 0;
let mediaList = [];

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

    const contactButton = document.querySelector(".contact_button");
    contactButton.onclick = () => displayModal(photographer.name);
}

function displayMedia(mediaArray, photographerName) {
    const mediaContainer = document.querySelector("#mediaContainer");

    mediaArray.forEach(media => {
        const mediaElement = mediaFactory(media, photographerName);
        mediaContainer.appendChild(mediaElement);
    });

    initLightbox();
}

function displayPhotographerInfo(photographer, mediaArray) {
    const totalLikes = mediaArray.reduce((acc, media) => acc + media.likes, 0);

    const infoContainer = document.getElementById('photographer-info-container');
    infoContainer.innerHTML = `
        <p>${totalLikes} <i class="fa-solid fa-heart"></i></p>
        <p>${photographer.price}€ / jour</p>
    `;
}

function openLightbox(index) {
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    const overlayLightbox = document.getElementById('overlay-lightbox');
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    img.style.display = "none";
    video.style.display = "none";
    img.src = "";
    video.src = "";

    if (mediaList[currentIndex].tagName == "IMG"){
      img.src = mediaList[currentIndex].src;
      img.style.display = "block";
    } else {
      video.src = mediaList[currentIndex].src;
      video.style.display = "block";
    }

    lightbox.style.display = "block"
    overlayLightbox.style.display = "block";
    document.querySelector('body').classList.add('overlay-body')
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
    document.getElementById('overlay-lightbox').style.display = "none";
    document.querySelector('body').classList.remove('overlay-body')
}

function changeMedia(step) {
    currentIndex += step;
    if (currentIndex >= mediaList.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = mediaList.length - 1;
    }

    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    img.style.display = "none";
    video.style.display = "none";
    img.src = "";
    video.src = "";

    if (mediaList[currentIndex].tagName == "IMG"){
      img.src = mediaList[currentIndex].src;
      img.style.display = "block";
    } else {
      video.src = mediaList[currentIndex].src;
      video.style.display = "block";
    }
}

function initLightbox() {
  mediaList = Array.from(document.querySelectorAll("#mediaContainer img, #mediaContainer video"));
  mediaList.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
  });

  // Ajoutez ici les écouteurs pour les boutons de navigation et de fermeture
  const closeButton = document.querySelector('.lightbox-close');
  const nextButton = document.querySelector('.lightbox-next');
  const prevButton = document.querySelector('.lightbox-prev');

  if (closeButton) {
      closeButton.addEventListener('click', closeLightbox);
  }
  if (nextButton) {
      nextButton.addEventListener('click', () => changeMedia(1));
  }
  if (prevButton) {
      prevButton.addEventListener('click', () => changeMedia(-1));
  }
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
