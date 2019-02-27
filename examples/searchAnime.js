'use-strict';

const wa = require('../src/wa');

const imgPath = 'assets/examples.png';

wa.searchAnime(imgPath)
  .then(searchResult => {
    console.log(searchResult);
  })
  .catch(err => {
    console.error(err);
  });
