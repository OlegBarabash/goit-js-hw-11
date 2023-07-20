import { searchRequest } from './js/search-request';
import Notiflix from 'notiflix';

const search = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let searchQuery = '';
let page;

search.addEventListener('submit', handlerSearch);
loadMore.addEventListener('click', handlerLoadeMore);

function handlerSearch(ev) {
  ev.preventDefault();
  loadMore.hidden = true;
  gallery.innerHTML = '';
  page = 1;
  searchQuery = ev.currentTarget.searchQuery.value;
  renderCards();
}

function handlerLoadeMore() {
  page += 1;
  renderCards();
}

async function renderCards() {
  try {
    const {
      data: { hits, totalHits },
    } = await searchRequest(searchQuery, page);
    if (!hits.length) {
      throw new Error('Empty');
    }
    gallery.insertAdjacentHTML('beforeend', getMarkup(hits));
    if (totalHits <= page * 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.hidden = true;
    } else {
      loadMore.hidden = false;
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function getMarkup(arr) {
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
  return markap;
}
