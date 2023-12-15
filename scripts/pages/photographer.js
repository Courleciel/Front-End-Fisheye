import photographerTemplate from "../templates/photographer.js";
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

  // Itérer sur chaque élément du tableau et les ajouter au DOM
  elements.forEach(element => {
    photographerSection.appendChild(element);
  });
}

function displayMedia(media) {
  // Ici, vous pouvez créer et ajouter des éléments HTML pour afficher les médias du photographe
  console.log(media);
}

async function init() {
  const data = await fetchData();
  const photographerId = getPhotographerId();

  if (data) {
      const photographer = data.photographers.find(p => p.id == photographerId);
      const media = data.media.filter(m => m.photographerId == photographerId);

      if (photographer) {
          displayPhotographer(photographer);
      }

      if (media.length > 0) {
          displayMedia(media);
      }
  }
}

init();
