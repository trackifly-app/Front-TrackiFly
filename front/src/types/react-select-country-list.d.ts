declare module 'react-select-country-list' {
  const countryList: () => {
    getData: () => { value: string; label: string }[];
  };
  export default countryList;
}
