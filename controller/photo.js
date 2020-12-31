import express from 'express';
import photos from '../mock/pictures.js';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';

import axios from 'axios';

import Photo from '../model/photo.js'

const router = new express.Router();

router.get('/public', (req, res) => {


  const url = `${process.env.URL}/photos`;
  axios.get(url).then(response => {
    console.log(response.data);
    const photos = "";
    res.render('photo/public',
      {
        photos: photos
      });
  }).catch(err => console.log(err));


});

router.get('/publish-photo', (req, res) => {
  console.log('route ok')
  res.render('photo/new-photo',
    {
      photos: photos
    });
});

router.get('/photo/manage', (req, res) => {
  console.log('route ok')
  res.render('photo/manage-photo',
    {

    });
});

router.post('/insert-photo', (req, res) => {
  //  console.log("Into insert photo")
  //  console.log(req.body);

  const photo = new Photo(1, req.body.title, 1, req.body.price, req.body.tags)
  console.log('built it');
  const json = photo.getJson();

  const jsonValue = {
    "fileName": "kiwi.jpg",
    "width": 800, "height": 600,
    "price": 12.99,
    "title": "Some Kiwi",
    "downloads": 0,
    "user": { "id": 2 },
    "tags": [{ "tag": "new" }, { "tag": "is this it?" }, { "tag": "AWESOME!!!" }]
  };


  console.log("Function json");
  console.log(json);


  console.log("Object json");
  console.log(jsonValue);
  const url = `${process.env.URL}/photos`;
  axios.post(url, json, { headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJidHNAZ21haWwuY29tIiwiZXhwIjoxNjA5OTkxMjQzfQ.3grSLGYZuRMZ_X8BEsksxu4Hc6K4Xkqvta5xC6lnNCokOkUZRgKAycn1y8z_HIVpBzIRIYzWmBJDgS1md-PIuw' } }).then(response => {

    const photos = "";
    console.log('ok?')
    res.render('photo/public',
      {
        photos: photos
      });
  }).catch(err => console.log(err));



});

export default router;