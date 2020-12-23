import express from 'express';

const router = new express.Router();

router.get('/login', (req, res)=>{
  res.render('photo/public');
});

router.get('/sign-up', (req, res)=>{
  res.render('user/sign-up',
    {});
});

router.get('/logout', (req, res)=>{
  res.render('photo/new-photo');
});

export default router;