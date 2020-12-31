import express from 'express';
import photos from '../mock/pictures.js';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

import Photo from '../model/photo.js';

const router = new express.Router();

router.get('/public', (req, res) => {
  const url = `${process.env.URL}/photos`;
  axios.get(url).then((response) => {
    console.log(response.data);
    const photos = '';
    res.render('photo/public',
        {
          photos: photos,
        });
  }).catch((err) => console.log(err));
});

router.get('/publish-photo', (req, res) => {
  res.render('photo/new-photo',
      {
      });
});

router.get('/photo/manage', (req, res) => {
  res.render('photo/manage-photo',
      {
      });
});
/**
 *  This is incredibly inefficient, I am saving on nodejs server then sending
 * it to the Java Server. It should either be refactored to Java deal with all
 *  the information or at least just forward the req.files.picture
 */
router.post('/insert-photo', (req, res) => {
  const user = req.session.user;
  if (user) {
    const photo = new Photo(0, req.body.title, user.id, req.body.price, req.body.tags);
    const json = photo.getJson();
    const url = `${process.env.URL}/photos`;
    const file = req.files;
    const token = req.session.user.token;

    axios.post(url, json, {headers: {'Authorization': token}})
        .then((response) => {
          const location = response.headers.location;
          // extracts id from location in response
          const photoId = location.substring(location.lastIndexOf('/') + 1);
          file.picture.mv(`resources/temp/temp.jpg`).then( () => { 
            const newFile = fs.createReadStream('resources/temp/temp.jpg');
            const fd = new FormData();
            fd.append('file', newFile);
            axios.post(`${url}/upload/${photoId}`, fd,
                {headers:
                  {'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                    ...fd.getHeaders(),
                  }})
                  .then((resp) => {
                    res.render('photo/public',
                    {
                      photos: photos,
                    });
                  }).catch((err) => console.log(err));
                });
              }).catch((err) => console.log(err));
          }
});

export default router;
