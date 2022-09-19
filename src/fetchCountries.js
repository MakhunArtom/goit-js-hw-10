export function fetchCountries(name) {
  const optionFilter = `?fields=name,capital,population,flags,languages`;

  return fetch(
    `https://restcountries.com/v3.1/name/${name}${optionFilter}`
  ).then(respons => respons.json());
}
