function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;
  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
      const article = document.createElement('article');

      const img = document.createElement('img');
      img.setAttribute("src", picture);
      img.setAttribute("alt", `Portrait de ${name}`);

      const h2 = document.createElement('h2');
      h2.textContent = name;

      const taglineElement = document.createElement('p');
      taglineElement.textContent = tagline;

      const locationElement = document.createElement('p');
      locationElement.textContent = `${city}, ${country}`;

      const priceElement = document.createElement('p');
      priceElement.textContent = `${price}€/jour`;

      article.appendChild(img);
      article.appendChild(h2);
      article.appendChild(taglineElement);
      article.appendChild(locationElement);
      article.appendChild(priceElement);

      return article;
  }

  return { getUserCardDOM };
}
