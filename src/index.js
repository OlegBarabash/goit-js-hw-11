import { searchRequest } from './js/search-request';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const search = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let searchQuery = '';
let page;
let galleryLightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

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
    if (!totalHits) {
      throw new Error('Empty');
    } else if (page === 1) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
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
  galleryLightbox.refresh();
}

function getMarkup(arr) {
  const markap = arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
         ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
         ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
         ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
         ${downloads}
      </p>
    </div>
  </div>`
    )
    .join('');
  return markap;
}
