import axios from 'axios';

const API_KEY = '38331073-f9ce91789c32f4e98a0c5c888';
const BASE_URL = `https://pixabay.com/api`;

axios.defaults.baseURL = BASE_URL;

async function searchRequest(searchQuery, page = 1) {
  const params = {
    params: {
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: page,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return await axios.get(`/?key=${API_KEY}`, params);
}

export { searchRequest };
