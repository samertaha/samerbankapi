const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3300;
app.set('port', process.env.PORT || 3300);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

let users = require('./users.json');

app.post('/api/user', (req, res) => {
  let { passportId, cash, credit } = req.body;

  const duplicateUsers = users.filter((user) => user.passportId === passportId);
  if (duplicateUsers.length === 0) {
    users.push({ passportId, cash, credit });
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.send({ result: `user ${passportId} added successfully!` });
  } else {
    res.send({ error: 'user already exist!' });
  }
});

app.post('/api/deposit/:passportId', (req, res) => {
  let { passportId } = req.params;
  passportId = Number(passportId);
  let { cash } = req.body;

  let user = users.find((user) => user.passportId === passportId);

  if (user) {
    user.cash += cash;
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.send({ result: `user deposited ${cash} successfuly!` });
  } else res.send({ error: 'user not found!' });
});

app.post('/api/credit/:passportId', (req, res) => {
  let { passportId } = req.params;
  passportId = Number(passportId);
  let { credit } = req.body;

  let user = users.find((user) => user.passportId === passportId);

  if (user && credit >= 0) {
    user.credit = credit;
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.send({ result: `user credited ${credit} successfuly!` });
  } else if (user) res.send({ error: 'only positive credit accepted!' });
  else res.send({ error: 'user not found !' });
});

app.post('/api/withdraw/:passportId', (req, res) => {
  let { passportId } = req.params;
  passportId = Number(passportId);
  let { amount } = req.body;

  let user = users.find((user) => user.passportId === passportId);

  if (user) {
    const remained = user.cash + user.credit;
  }

  if (user && remained >= amount) {
    user.cash = user.cash >= amount ? user.cash - amount : 0;
    amount -= user.cash;
    user.credit = amount > 0 ? user.credit - amount : user.credit;
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.send({ result: `user withdrow ${amount} successfuly!` });
  } else if (user && remained < amount)
    res.send({ error: 'not enough cash and credit !' });
  else res.send({ error: 'user not found !' });
});

app.post('/api/transfer', (req, res) => {
  let { from, to, amount } = req.body;

  let fromUser = users.find((user) => user.passportId === from);
  let toUser = users.find((user) => user.passportId === to);
  const bothExist = fromUser && toUser;
  let balance = 0,
    balanceEnough = false;

  if (bothExist) {
    balance = fromUser.cash + fromUser.credit;
    balanceEnough = balance - amount >= 0;
  }

  if (bothExist && balanceEnough) {
    toUser.cash += amount;
    fromUser.cash = fromUser.cash >= amount ? fromUser.cash - amount : 0;
    amount -= fromUser.cash;
    fromUser.credit = amount > 0 ? fromUser.credit - amount : fromUser.credit;
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.send({ result: `amount of ${amount} successfuly transfe!` });
  } else if (bothExist && !balanceEnough)
    res.send({ error: 'not enough cash and credit !' });
  else res.send({ error: 'user not found !' });
});

app.get('/api/user/:passportId', (req, res) => {
  let { passportId } = req.params;
  passportId = Number(passportId);
  const user = users.find((user) => user.passportId === passportId);

  if (user) {
    res.send({ ...user });
  } else res.send({ error: 'user not found !' });
});

app.get('/api/users', (req, res) => {
  if (users) {
    res.send(users);
  } else res.send({ error: 'users empty !' });
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
