import { PixabayAPI } from './PixabayAPI';
import refs from './refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
  width: '500px',
  position: 'left-top',
});

let page = 1;
const pixabayApi = new PixabayAPI();
var lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });


refs.form.addEventListener('submit', onSearchFormSubmit);
refs.buttonLoadMore.addEventListener('click', onClickLoadMore);


async function onSearchFormSubmit(event) {
  event.preventDefault();
  let searchQuery = event.currentTarget.elements['searchQuery'].value.trim();

  if (!searchQuery.trim()) {
    refs.buttonLoadMore.classList.add('is-hidden');
    return Notiflix.Notify.warning(
      "Please enter a keyword to search."
    );
  }else if(searchQuery === pixabayApi.query){
    refs.buttonLoadMore.classList.add('is-hidden');
    return Notiflix.Notify.warning(
      "Please enter a new keyword to search.The result of this query is displayed."
    );
  }
  pixabayApi.query = searchQuery;
  page = 1;

  try {
    // refs.loader.classList.add('.is-hidden');
    const response = await pixabayApi.getPhotosByQuery(page);
    refs.galleryList.innerHTML = '';

    const totalPhotos = response.data.totalHits;
    let currentAmountPhotos = response.data.hits.length * page;
    let dataByQuery = response.data.hits;

    if (totalPhotos) {
      Notiflix.Notify.success(`Hooray! We found ${totalPhotos} images.`);
    }

    renderMarkupGallery(dataByQuery);

    if (totalPhotos > currentAmountPhotos) {
      refs.buttonLoadMore.classList.remove('is-hidden');
    } else if (totalPhotos === 0) {
      refs.buttonLoadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      refs.buttonLoadMore.classList.add('is-hidden');
    }
    
  } catch (error) {
    console.log(error);
  }

  refs.form.reset();
}


async function onClickLoadMore() {
  refs.buttonLoadMore.classList.add('.is-hidden');
  page += 1;
  pixabayApi.page = page;

  try {
    const response = await pixabayApi.getPhotosByQuery(page);
    refs.buttonLoadMore.classList.remove('is-hidden');
    let dataByQuery = response.data.hits;
    let currentAmountPhotos = response.data.hits.length * page;
    const totalPhotos = response.data.totalHits;

    renderMarkupGallery(dataByQuery);

    if (totalPhotos > currentAmountPhotos) {
      refs.buttonLoadMore.classList.remove('is-hidden');
    } else if (totalPhotos === 0) {
      refs.buttonLoadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      refs.buttonLoadMore.classList.add('is-hidden');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    
    smoothGalleryScroll()

  } catch (error) {
    console.log(error);
  }
}


function renderMarkupGallery(res) {
  const markup = res
    .map(el => {
      return `<div class="photo-card"><div class="gallery"><a class="gallery__link" href="${el.largeImageURL}"><img class="gallery-img" src="${el.webformatURL}" alt="${el.tags}" loading="lazy"/></a></div><div class="info"><p class="info-item"><b>Likes</b><br>${el.likes}</br></p><p class="info-item"><b>Views</b><br>${el.views}</br></p><p class="info-item"><b>Comments</b><br>${el.comments}</br></p><p class="info-item"><b>Downloads</b><br>${el.downloads}</br></p></div></div>`;
    })
    .join('');
  refs.galleryList.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}


function smoothGalleryScroll() {

  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
