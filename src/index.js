import './css/styles.css';
import './css/countries.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import {fetchCountries} from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
    inputSearch: document.querySelector('#search-box'),
    listCountry: document.querySelector('.country-list'),
    cardCountry: document.querySelector('.country-info'),

}
refs.inputSearch.addEventListener("input", debounce(onInputSearchQuery,DEBOUNCE_DELAY));

function onInputSearchQuery(event) {
    const query = event.target.value.trim();
    
    if (query.length > 0) {
        
      fetchCountries(query).then((posts) => CountryRender(posts)).catch(error => {
        console.log(error.message);
        if (error.message === "404") {
           Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      });
    } else {
      refs.listCountry.innerHTML = '';
      refs.cardCountry.innerHTML = '';
    }
}

function CountryRender(countries) {
  const countCountry = countries.length;
  let markup = '';
  let markupCard = '';
  if (countCountry > 10) {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
  } else if (countCountry === 1) {
   
    markupCard = countries
      .map(({ name, flags, capital, population, languages }) => {
        const lang = Object.values(languages);
        return `<ul class="card-list"><li class="title-card-list"><img src="${flags.svg}" width="48" height="32" class="icon-card-list"><div class="name-card-list">${name.official}</div></li>
         <li><span class="key-card-list">Capital: </span>${capital}</li>
         <li><span class="key-card-list">Population: </span>${population}</li>
         <li><span class="key-card-list">Languages: </span>${lang}</li></ul>`;
      })
      .join("");
  } else {
    
    markup = countries
      .map(({ name, flags }) => {
        return `<li><img src="${flags.svg}" width="18" height="12" class="icon-flag"><div>${name.official}</div>
        </li>`;
      })
      .join("");
  }
  refs.listCountry.innerHTML = markup;
  refs.cardCountry.innerHTML = markupCard;
}

