import photographerTemplate from "../templates/photographer.js";
import mediaFactory from "../factories/MediaFactory.js";

let currentIndex = 0;
let mediaList = [];
let previouslyFocusedElement = null; // Pour stocker l'élément précédemment focalisé

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
  previouslyFocusedElement = document.activeElement;
  currentIndex = index;
  const lightbox = document.getElementById('lightbox');
  const overlayLightbox = document.getElementById('overlay-lightbox');
  const img = document.getElementById('lightbox-img');
  const video = document.getElementById('lightbox-video');

  img.style.display = "none";
  video.style.display = "none";
  img.src = "";
  video.src = "";
  img.removeAttribute('aria-label');
  video.removeAttribute('aria-label');

  const media = mediaList[currentIndex];
  if (media.tagName == "IMG") {
      img.src = media.src;
      img.style.display = "block";
      img.setAttribute('aria-label', `${media.alt}`);
  } else {
      video.src = media.src;
      video.style.display = "block";
      video.setAttribute('aria-label', `${media.title}`);
  }

  lightbox.style.display = "block";
  overlayLightbox.style.display = "block";
  document.querySelector('body').classList.add('overlay-body');
  lightbox.focus();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const overlayLightbox = document.getElementById('overlay-lightbox');
    lightbox.style.display = "none";
    overlayLightbox.style.display = "none";
    document.querySelector('body').classList.remove('overlay-body');

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
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
  img.removeAttribute('aria-label');
  video.removeAttribute('aria-label');

  const media = mediaList[currentIndex];
  if (media.tagName == "IMG") {
      img.src = media.src;
      img.style.display = "block";
      img.setAttribute('aria-label', `${media.alt}`);
  } else {
      video.src = media.src;
      video.style.display = "block";
      video.setAttribute('aria-label', `${media.title}`);
  }
}

function initLightbox() {
    mediaList = Array.from(document.querySelectorAll("#mediaContainer img, #mediaContainer video"));
    mediaList.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

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

    document.addEventListener('keydown', (e) => {
        const lightboxVisible = document.getElementById('lightbox').style.display === 'block';
        if (!lightboxVisible) {
            return; // Si la lightbox n'est pas ouverte, ne pas traiter les événements clavier
        }

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            changeMedia(1);
        } else if (e.key === 'ArrowLeft') {
            changeMedia(-1);
        }
    });

    const lightbox = document.getElementById('lightbox');
    lightbox.setAttribute('tabindex', '-1'); // Permettre à la lightbox de recevoir le focus
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
