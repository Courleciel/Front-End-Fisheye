    async function getPhotographers() {
      try {
          // Utilisation de fetch pour récupérer les données depuis le fichier JSON
          const response = await fetch('data/photographers.json');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          // Retourner les données
          return data.photographers;
      } catch (error) {
          console.error('Could not fetch photographers data:', error);
      }
    }


    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        const photographers = await getPhotographers();
        displayData(photographers);
    }

    init();
