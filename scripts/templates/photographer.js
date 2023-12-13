function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;
  const picture = `assets/photographers/${portrait}`;
  const photographerPageURL = `photographer.html?id=${id}`;

  function getUserCardDOM() {
      const article = document.createElement('article');

      const link = document.createElement('a');
      link.setAttribute('href', photographerPageURL);
      link.classList.add('photographer-link');

      const img = document.createElement('img');
      img.setAttribute("src", picture);
      img.setAttribute("alt", `${name}`);
      img.classList.add('photographer-portrait');

      const h2 = document.createElement('h2');
      h2.textContent = name;
      h2.classList.add('photographer-name');

      link.appendChild(img);
      link.appendChild(h2);

      const locationElement = document.createElement('p');
      locationElement.textContent = `${city}, ${country}`;
      locationElement.classList.add('photographer-location');

      const taglineElement = document.createElement('p');
      taglineElement.textContent = tagline;
      taglineElement.classList.add('photographer-tagline');

      const priceElement = document.createElement('p');
      priceElement.textContent = `${price}€/jour`;
      priceElement.classList.add('photographer-price');

      article.appendChild(link);
      article.appendChild(locationElement);
      article.appendChild(taglineElement);
      article.appendChild(priceElement);

      return article;
  }

  return { getUserCardDOM };
}
