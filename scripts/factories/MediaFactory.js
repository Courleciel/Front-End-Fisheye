// MediaFactory.js

function createImageElement(media, photographerName) {
  const img = document.createElement('img');
  img.classList.add('photographer-photos');
  img.src = `assets/FishEye_Photos/Sample Photos/${photographerName}/${media.image}`;
  img.alt = media.title;
  return img;
}

function createVideoElement(media, photographerName) {
  const video = document.createElement('video');
  video.classList.add('photographer-videos');
  video.src = `assets/FishEye_Photos/Sample Photos/${photographerName}/${media.video}`;
  video.controls = true;
  video.setAttribute('aria-label', media.title);
  return video;
}

function createMediaElement(media, photographerName, isVideo) {
  const mediaElement = isVideo ? createVideoElement(media, photographerName) : createImageElement(media, photographerName);
  const container = document.createElement('div');
  const infoContainer = document.createElement('div');
  const title = document.createElement('p');
  const likes = document.createElement('p');
  const likeIcon = document.createElement('i');

  container.classList.add('media-container');
  infoContainer.classList.add('media-informations');
  title.classList.add('media-title');
  likes.classList.add('media-likes');
  likeIcon.classList.add('fa-solid', 'fa-heart');
  likeIcon.setAttribute('aria-label', 'likes');
  likeIcon.id = `like-${media.id}`

  title.textContent = media.title;
  likes.textContent = `${media.likes} `;
  likes.appendChild(likeIcon);

  infoContainer.appendChild(title);
  infoContainer.appendChild(likes);
  container.appendChild(mediaElement);
  container.appendChild(infoContainer);

  return container;
}

export default function mediaFactory(media, photographerName) {
  return createMediaElement(media, photographerName, 'video' in media);
}
