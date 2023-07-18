import axios from 'axios';

const API_KEY = '38331073-f9ce91789c32f4e98a0c5c888';
const BASE_URL = `https://pixabay.com/api`;

axios.defaults.baseURL = BASE_URL;

async function searchRequest(searchQuery) {
  const params = `&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
  try {
    const response = await axios.get(`/?key=${API_KEY}${params}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export { searchRequest };
