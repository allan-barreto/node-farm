// Modules

const fs = require('fs');

const express = require('express');
const slugify = require('slugify');

const app = express();
const { parse } = require('path');
const replaceTemp = require('./src/templates/replace-template');

// SYNC code

const tempProduct = fs.readFileSync(
  `${__dirname}/src/templates/template-product.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/src/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/src/templates/template-card.html`,
  'utf-8'
);

// JSON database

const data = fs.readFileSync(`${__dirname}/src/dev-data/data.json`);
const dataObj = JSON.parse(data);

// slugify

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// ASYNC code

app.get('/', (req, res) => {
  const cardsHtml = dataObj.map((el) => replaceTemp(tempCard, el)).join('');
  const homePage = tempOverview.replace(`{%PRODUCTCARD%}`, cardsHtml);
  res.send(homePage).status(200);
});

app.get('/product', (req, res) => {
  const product = dataObj[req.query.id];
  const productPage = replaceTemp(tempProduct, product);
  res.send(productPage);
});

// Server

app.listen(5000, () => {
  console.log('Listen to the port 5000');
});
