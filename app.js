const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  console.log("Nick's Google Playstore API");
})

app.listen(8080, () => {
  console.log('Server started on PORT 8080');
});