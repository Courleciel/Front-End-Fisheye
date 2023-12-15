export default function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;
  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {

    // Création des éléments communs
    const img = document.createElement('img');
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    img.classList.add('photographer-portrait');

    const h2 = document.createElement('h2');
    h2.textContent = name;
    h2.classList.add('photographer-name');

    const locationElement = document.createElement('p');
    locationElement.textContent = `${city}, ${country}`;
    locationElement.classList.add('photographer-location');

    const taglineElement = document.createElement('p');
    taglineElement.textContent = tagline;
    taglineElement.classList.add('photographer-tagline');

    const priceElement = document.createElement('p');
    priceElement.textContent = `${price}€/jour`;
    priceElement.classList.add('photographer-price');

    const article = document.createElement('article');
    article.classList.add('photographer-article');

    const link = document.createElement('a');
    link.setAttribute('href', `photographer.html?id=${id}`);
    link.classList.add('photographer-link');
    link.appendChild(img);
    link.appendChild(h2);
    article.appendChild(link);

    article.appendChild(locationElement);
    article.appendChild(taglineElement);
    article.appendChild(priceElement);

    return article;
    }

    function getUserHeader() {

      const img = document.createElement('img');
      img.setAttribute("src", picture);
      img.setAttribute("alt", name);
      img.classList.add('photographer-portrait');

      const infoContainer = document.createElement('div');
      infoContainer.classList.add('photographer-info');

      const h2 = document.createElement('h2');
      h2.textContent = name;
      h2.classList.add('photographer-name');

      const locationElement = document.createElement('p');
      locationElement.textContent = `${city}, ${country}`;
      locationElement.classList.add('photographer-location');

      const taglineElement = document.createElement('p');
      taglineElement.textContent = tagline;
      taglineElement.classList.add('photographer-tagline');

      infoContainer.appendChild(h2);
      infoContainer.appendChild(locationElement);
      infoContainer.appendChild(taglineElement);

      return [img, infoContainer];

    }
    return { getUserCardDOM, getUserHeader}
  }
