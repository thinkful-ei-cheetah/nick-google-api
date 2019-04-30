const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore.js');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  console.log("Nick's Google Playstore API");
  res
    .json(playstore);
})

app.get('/apps', (req, res) => {
  let { sort, genres } = req.query;
  let results = playstore;

  const possibleSorts = ['rating', 'app'];
  const possibleGenres = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];

  if(sort) {
    sort = sort.toLowerCase();

    if(!possibleSorts.includes(sort.toLowerCase())) {
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    } else {
      sort = sort.charAt(0).toUpperCase() + sort.slice(1);

      results.sort((a, b) => {
        return a[sort] > b[sort] 
          ? 1 
          : a[sort] < b[sort]
          ? -1
          : 0;
      })
    }
  }

  if(genres) {
    genres = genres.charAt(0).toUpperCase() + genres.slice(1);

    if(!possibleGenres.includes(genres.toLowerCase())) {
      return res
        .status(400)
        .send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, Card');
    } else {
      results = results.filter( app => app.Genres.includes(genres) )
    }
  }

  res
    .status(200)
    .json(results);
});

app.listen(8080, () => {
  console.log('Server started on PORT 8080');
});