import express from 'express';
import axios from 'axios';

const router = new express.Router();

router.post('/search', (req, res) => {
  let tags = req.body.tags;
  if (tags) {
    tags = tags.toLowerCase();
    tags = tags.split(/[ ,\.#]/);
    tags = new Set(tags);
    const tagArray = [];
    tags.forEach((tag) => {
      if (tag != '') {
        tagArray.push({tag: tag});
      }
    });
    const tagString = tagArray.map( (tag) => {
      if (tag && tag != '') {
        return tag.tag;
      }
    }).join(' ');
    const url = `${process.env.URL}/tags/tag=`;

    const photos = new Set();

    Promise.all( tagArray.map( (tag) => {
      return axios.get(`${url}${tag.tag}`).then((response) => {
        const tag = response.data;
        let found = [];
        if (tag) {
          found = tag.photos;
          found.forEach( (photo) => {
            // this is necessary for comparing objects in a set
            photos.add(JSON.stringify(photo));
          });
        }
      }).catch((error)=>{
        console.log(error);
      });
    })).then( () => {
      const uniquePhotos = [];
      photos.forEach( (photo) => uniquePhotos.push(JSON.parse(photo)));
      console.log(photos);
      res.render('photo/photos-by-tag',
          {
            tags: tagString,
            photos: uniquePhotos,
          });
    });
  } else {
    res.redirect('/');
  }
});

export default router;
