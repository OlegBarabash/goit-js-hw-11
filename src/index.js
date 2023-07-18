import { searchRequest } from './js/search-request';

const search = document.querySelector('.search-form');
search.addEventListener('submit', handlerSearch);

function handlerSearch(ev) {
  ev.preventDefault();

  const searchQuery = ev.currentTarget.searchQuery.value;
  searchRequest(searchQuery).then(resolt => {
    console.log(resolt);
  });
}
