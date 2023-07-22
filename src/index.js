import { searchRequest } from './js/search-request';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const search = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
//const loadeMoreBtn = document.querySelector('.load-more');
const loadMoreGuard = document.querySelector('.js-guard');

let searchQuery = '';
let page;
const galleryLightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

search.addEventListener('submit', handlerSearch);
//loadeMoreBtn.addEventListener('click', handlerLoadeMore);

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};

const observer = new IntersectionObserver(handlerInfiniteScroll, options);

async function handlerSearch(ev) {
  ev.preventDefault();
  //loadeMoreBtn.hidden = true;
  gallery.innerHTML = '';
  page = 1;
  searchQuery = ev.currentTarget.searchQuery.value;
  if (!searchQuery.trim()) {
    return;
  }
  await renderCards();
  if (gallery.children.length === 40) {
    observer.observe(loadMoreGuard);
  }
}

function handlerInfiniteScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      handlerLoadeMore();
    }
  });
}

async function handlerLoadeMore() {
  page += 1;
  await renderCards();
  //smoothScroll();
}

async function renderCards() {
  console.log(' renderCards() call');
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
      observer.unobserve(loadMoreGuard);
      //loadeMoreBtn.hidden = true;
    }
    // else {
    //   loadeMoreBtn.hidden = false;
    // }
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

// function smoothScroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
