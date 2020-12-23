import express from 'express';
import photos from '../mock/pictures.js';

const router = new express.Router();

router.get('/public', (req, res)=>{
  console.log('route ok')
  res.render('photo/public',
    {
      photos : photos
    });
});

router.get('/publish-photo', (req, res)=>{
  console.log('route ok')
  res.render('photo/new-photo',
    {
      photos : photos
    });
});

export default router;