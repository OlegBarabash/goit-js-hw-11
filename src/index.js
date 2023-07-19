import { searchRequest } from './js/search-request';
import Notiflix from 'notiflix';

const search = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
search.addEventListener('submit', handlerSearch);

function handlerSearch(ev) {
  ev.preventDefault();

  gallery.innerHTML = '';
  const searchQuery = ev.currentTarget.searchQuery.value;
  searchRequest(searchQuery)
    .then(resolt => {
      if (!resolt.data.hits.length) {
        throw new Error('Empty');
      }
      renderCards(resolt.data.hits);
    })
    .catch(err => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}

function renderCards(arr) {
  const markap = arr
    .map(
      info =>
        `<div class="photo-card">
    <img src="${info.webformatURL}" alt="${info.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
         ${info.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
         ${info.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
         ${info.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
         ${info.downloads}
      </p>
    </div>
  </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markap);
}
