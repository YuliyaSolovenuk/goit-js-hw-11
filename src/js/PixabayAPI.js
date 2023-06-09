import axios from "axios";

export class PixabayAPI {
  #URL = 'https://pixabay.com/api/';
  #API_KEY = '37047125-896a571f84c209518000927cd';
  query = "";

  constructor(query, page) {
    this.query = query; 
    this.page = page;
  }

  async getPhotosByQuery(page) {
   
    return await axios.get(`${this.#URL}`, {
    // return axios.get(`${URL}?key=${API_KEY}q=${query}&image_type=photo&orientation=horizontal&safesearch=true`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40
      }
    })
  }
  
 
}




