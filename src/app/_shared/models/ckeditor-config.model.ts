export const ckeditorConfig = function (customConfig = {}) {
  return {
    editorplaceholder: 'Wpisz opis',
    extraPlugins: 'editorplaceholder',
    height: 110,
    language: 'pl',
    ...customConfig
    // stylesSet: []
  };
};
