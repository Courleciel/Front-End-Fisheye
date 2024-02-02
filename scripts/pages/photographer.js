// Import des modules et fichiers nécessaires
import photographerTemplate from "../templates/photographer.js";
import mediaFactory from "../factories/MediaFactory.js";
import { displayModal } from "../utils/contactForm.js";

// Variables globales
let currentIndex = 0;
let mediaList = [];
let mediaArray = [];
let previouslyFocusedElement = null;

// Fonction asynchrone pour récupérer les données des photographes
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


// Fonction pour obtenir l'ID du photographe depuis les paramètres de l'URL
function getPhotographerId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Fonction pour afficher les informations du photographe
function displayPhotographer(photographer) {
    const photographerSection = document.querySelector(".photograph-header");
    const elements = photographerTemplate(photographer).getUserHeader();

    elements.forEach(element => {
        photographerSection.appendChild(element);
    });

    const contactButton = document.querySelector(".contact_button");
    contactButton.onclick = () => displayModal(photographer.name);
}

// Fonction pour afficher les médias du photographe
function displayMedia(mediaArray, photographerName, photographer) {
    const mediaContainer = document.querySelector("#mediaContainer");
    mediaContainer.innerHTML = '';

    mediaArray.forEach(media => {
        const mediaElement = mediaFactory(media, photographerName);
        mediaContainer.appendChild(mediaElement);
        media.liked = false;
    });

    mediaArray.forEach(media => {
        const likeIcon = document.getElementById(`like-${media.id}`);
        likeIcon.addEventListener('click', () => handleLikeClick(media, photographer, mediaArray));
    });

}

// Fonction pour afficher les informations du photographe (likes et tarif)
function displayPhotographerInfo(photographer, mediaArray) {
    const totalLikes = mediaArray.reduce((acc, media) => acc + Number(media.likes), 0);

    const infoContainer = document.getElementById('photographer-info-container');
    infoContainer.innerHTML = `
        <p id="total-likes">${totalLikes} <i class="fa-solid fa-heart"></i></p>
        <p>${photographer.price}€ / jour</p>
    `;
}

// Fonction pour gérer le clic sur le bouton "J'aime"
function handleLikeClick(media, photographer, mediaArray) {
    if (!media.liked) {
        media.likes++;
        media.liked = true;
        const likesElement = document.getElementById(`like-${media.id}`).parentNode;
        likesElement.innerHTML = `${media.likes} <i class="fa-solid fa-heart" aria-label="likes" id="like-${media.id}"></i>`;

        displayPhotographerInfo(photographer, mediaArray);
    }
}

// Fonction pour ouvrir la lightbox
function openLightbox(index) {

    previouslyFocusedElement = document.activeElement;
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    const overlayLightbox = document.getElementById('overlay-lightbox');
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    const title = document.getElementById('lightbox-title');

    img.style.display = "none";
    video.style.display = "none";
    img.src = "";
    video.src = "";
    img.removeAttribute('alt');
    video.removeAttribute('aria-label');

    const media = mediaList[currentIndex];
    if (media.tagName == "IMG") {
        img.src = media.src;
        img.style.display = "block";
        img.setAttribute('alt', `${media.alt}`);
        title.textContent = media.alt;
    } else {
        video.src = media.src;
        video.style.display = "block";
        title.textContent = media.getAttribute('aria-label');
    }

    lightbox.style.display = "block";
    overlayLightbox.style.display = "block";
    document.querySelector('body').classList.add('overlay-body');
    lightbox.focus();
}

// Fonction pour fermer la lightbox
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

// Fonction pour changer de média dans la lightbox
function changeMedia(step) {
    currentIndex += step;
    if (currentIndex >= mediaList.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = mediaList.length - 1;
    }

    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    const title = document.getElementById('lightbox-title');

    img.style.display = "none";
    video.style.display = "none";
    img.src = "";
    video.src = "";
    img.removeAttribute('alt');
    video.removeAttribute('aria-label');

    const media = mediaList[currentIndex];
    if (media.tagName == "IMG") {
        img.src = media.src;
        img.style.display = "block";
        img.setAttribute('alt', `${media.alt}`);
        title.textContent = media.alt;
    } else {
        video.src = media.src;
        video.style.display = "block";
        title.textContent = media.getAttribute('aria-label');
    }
}

// Fonction pour initialiser la lightbox
function initLightbox() {
    mediaList = Array.from(document.querySelectorAll("#mediaContainer img, #mediaContainer video"));
    mediaList.forEach((item, index) => {
        item.removeEventListener('click', openLightbox);
        item.addEventListener('click', () => openLightbox(index));
    });

    const closeButton = document.querySelector('.lightbox-close');
    const nextButton = document.querySelector('.lightbox-next');
    const prevButton = document.querySelector('.lightbox-prev');

    if (closeButton) {
      closeButton.onclick = () => closeLightbox();
    }
    if (nextButton) {
        nextButton.onclick = () => changeMedia(1);
    }
    if (prevButton) {
      prevButton.onclick = () => changeMedia(-1);
    }
    document.removeEventListener('keydown', changeMediaByKeydown)
    document.addEventListener('keydown', changeMediaByKeydown);

    const lightbox = document.getElementById('lightbox');
    lightbox.setAttribute('tabindex', '-1');
}

function changeMediaByKeydown(e) {
  const lightboxVisible = document.getElementById('lightbox').style.display === 'block';
  if (!lightboxVisible) {
      return;
  }

  if (e.key === 'Escape') {
      closeLightbox();
  } else if (e.key === 'ArrowRight') {
      changeMedia(1);
  } else if (e.key === 'ArrowLeft') {
      changeMedia(-1);
  }
}

// Fonction pour trier les médias du photographe en fonction du critère choisi
function sortMedia(criteria, photographer, mediaArray) {
    if (criteria === 'likes') {
        mediaArray.sort((a, b) => b.likes - a.likes);
    } else if (criteria === 'title') {
        mediaArray.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criteria === 'date') {
        mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const mediaContainer = document.querySelector("#mediaContainer");
    mediaContainer.innerHTML = '';
    const nextButton = document.querySelector('.lightbox-next');
    nextButton.removeEventListener('click', () => changeMedia(1), true);
    displayMedia(mediaArray, photographer.name, photographer);
    initLightbox();
    mediaList = Array.from(document.querySelectorAll("#mediaContainer img, #mediaContainer video"));
}

// Fonction d'initialisation principale
async function init() {
    const data = await fetchData();
    const photographerId = getPhotographerId();

    if (data) {
        const photographer = data.photographers.find(p => p.id == photographerId);
        if (photographer) {
            displayPhotographer(photographer);
            mediaArray = data.media.filter(m => m.photographerId == photographerId);
            if (mediaArray.length > 0) {
                displayMedia(mediaArray, photographer.name, photographer);
                initLightbox();
                displayPhotographerInfo(photographer, mediaArray);
            }
        }

        // Écouteur d'événement pour le changement de critère de tri
        document.getElementById('sort-select').addEventListener('change', (event) => {
            sortMedia(event.target.value, photographer, mediaArray);
        });
      }
}

// Appel de la fonction d'initialisation
init();
