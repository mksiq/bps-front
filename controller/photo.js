import express from 'express';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

import Photo from '../model/photo.js';

const router = new express.Router();

router.get('/public', (req, res) => {
  const url = `${process.env.URL}/photos`;
  axios.get(url).then((response) => {
    const photos = response.data;
    photos.forEach( (photo) => {
      photo.tags = tagsToString(photo.tags);
    });
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

router.get('/photo/manage/:id', (req, res) => {
  const user = req.session.user;
  const url = `${process.env.URL}/photos/${req.params.id}`;
  if (user) {
    const token = req.session.user.token;
    axios.get(url, {headers: {'Authorization': token}})
        .then((response) => {
          const photo = response.data;
          photo.tags = tagsToString(photo.tags);
          res.render('photo/manage-photo',
              {
                photo: photo,
              });
        }).catch((err) => {
          console.error(err);
          res.redirect('/');
        });
  } else {
    res.redirect('/');
  }
});

router.post('/update-photo', (req, res) => {
  const user = req.session.user;
  if (user) {
    const {id, title, price, tags } = req.body;
    const photo = new Photo(id, title, user.id, price, tags);
    const json = photo.getJson();
    const url = `${process.env.URL}/photos/${photo.id}`;
    const token = req.session.user.token;
    axios.put(url, json ,{headers: {'Authorization': token}})
        .then((response) => {
          res.redirect('/account');
        }).catch((err) => {
          console.error(err);
          res.redirect('/');
        });
  } else {
    res.redirect('/');
  }
});

/**
 *  This is incredibly inefficient, I am saving on nodejs server then sending
 * it to the Java Server. It should either be refactored to Java deal with all
 *  the information or at least just forward the req.files.picture
 */
router.post('/insert-photo', (req, res) => {
  const user = req.session.user;
  if (user) {
    const {title, price, tags} = req.body;
    const photo = new Photo(0, title, user.id, price, tags);
    const json = photo.getJson();
    const url = `${process.env.URL}/photos`;
    const file = req.files;
    const token = req.session.user.token;

    axios.post(url, json, {headers: {'Authorization': token}})
        .then((response) => {
          const location = response.headers.location;
          // extracts id from location in response
          const photoId = location.substring(location.lastIndexOf('/') + 1);
          file.picture.mv(`resources/temp/temp.jpg`).then(() => {
            const newFile = fs.createReadStream('resources/temp/temp.jpg');
            const fd = new FormData();
            fd.append('file', newFile);
            axios.post(`${url}/upload/${photoId}`, fd,
                {
                  headers:
                      {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data',
                        ...fd.getHeaders(),
                      },
                })
                .then((resp) => {
                  res.redirect('/account');
                }).catch((err) => console.log(err));
          });
        }).catch((err) => console.log(err));
  } else {
    res.redirect('/');
  }
});

function tagsToString(tags) {
  tags.sort((a, b) => (a.tag > b.tag) ? 1 : ((b.tag > a.tag) ? -1 : 0));
  tags = tags.map( (tag) => {
    if (tag && tag != '') {
      return tag.tag;
    }
  }).join(' ');
  while (tags[0] === ' ') {
    tags = tags.substring(1);
  }
  return tags;
}

export default router;
