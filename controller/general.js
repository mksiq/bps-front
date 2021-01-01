import express from 'express';

const router = new express.Router();

router.get('/', (req, res)=>{
  const user = req.session.user;
  res.render('general/index', {
    user: user,
  });
});


export default router;
