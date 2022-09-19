import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector("input[id='search-box']"),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onNameInput, DEBOUNCE_DELAY));

function onNameInput(e) {
  const eventValue = e.target.value.trim();

  // Якщо користувач стер Value в Інпуті .........
  if (eventValue === '') {
    refs.ul.innerHTML = '';
    refs.div.innerHTML = '';
    return;
  }

  fetchCountries(eventValue)
    .then(renderCantryName)
    .then(renderCantryInfo)
    .catch(countryNotFound);
}

// функція що виводить флаг та назву країни
function renderCantryName(date) {
  refs.ul.innerHTML = '';
  // вилазить повідомлення якщо знайшло більше 10 країн
  if (date.length > 10) {
    refs.ul.innerHTML = '';
    refs.div.innerHTML = '';
    Notify.info('Too many matches found. Please enter a more specific name.');
    return [];
  }

  const renderLi = date
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class='countey-element'>
        <img class="countri-flag" src=${svg}></img>
        <h2 class="countri-name">${official}</h2>
        </li>`
    )
    .join('');

  refs.ul.insertAdjacentHTML('afterbegin', renderLi);

  return date;
}

// Виводить інфу про країну якщо в фільтрі одна країна
function renderCantryInfo(date) {
  refs.div.innerHTML = '';
  if (date.length === 1) {
    const cantryInfo = date
      .map(
        ({ capital, population, languages }) =>
          `<p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${Object.values(languages)} </p>`
      )
      .join('');
    refs.div.insertAdjacentHTML('afterbegin', cantryInfo);
  }
}

// Помилка якщо ввели не назву країни
function countryNotFound() {
  refs.ul.innerHTML = '';
  refs.div.innerHTML = '';
  Notify.failure('Oops, there is no country with that name');
}
