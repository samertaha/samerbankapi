const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3300;
app.set('port', process.env.PORT || 3300);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/:location', (req, res) => {
  let { location } = req.params;

  try {
    axios
      .get(`https://goweather.herokuapp.com/weather/${location}`)
      .then((result) => {
        res.json({ temp: result?.data?.temperature });
      })
      .catch((err) => {
        console.log('error : ', err);
      });
  } catch (err) {
    console.log(err);
    // res.status(err.status).send('err.message');
  }
});

app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', function (_, res) {
  res.sendFile(
    path.join(__dirname, './client/build/index.html'),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
// }

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
