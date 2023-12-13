function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;
  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
      const article = document.createElement('article');

      const img = document.createElement('img');
      img.setAttribute("src", picture);
      img.setAttribute("alt", `${name}`);
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

      article.appendChild(img);
      article.appendChild(h2);
      article.appendChild(locationElement);
      article.appendChild(taglineElement);
      article.appendChild(priceElement);

      return article;
  }

  return { getUserCardDOM };
}
