import express from 'express';

const router = new express.Router();

router.get('/', (req, res)=>{
  const user = req.session.user;
  const cart = req.session.cart;
  res.render('general/index', {
    user: user,
    cart: cart,
  });
});


export default router;
