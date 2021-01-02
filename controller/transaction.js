import express from 'express';
import axios from 'axios';
import Transaction from '../model/transaction.js';

const router = new express.Router();

router.get('/add/:id', (req, res) => {
  let cart = req.session.cart;
  if (!cart) {
    cart = [];
  }
  const index = cart.findIndex((photo) => photo.id == req.params.id);
  if (index === -1) {
    cart.push( {id: req.params.id});
  }
  req.session.cart = cart;
  res.redirect('/cart');
  console.log(cart);
});

router.get('/cart', (req, res) => {
  const cart = req.session.cart;
  console.log(cart);
  const url = `${process.env.URL}/photos/`;
  axios.get(url).then((response) => {
    const photos = response.data.filter((photo) => {
      for (let index = 0; index < cart.length; index++) {
        if (photo.id == cart[index].id) {
          /** Replace picture by its thumbnail */
          const slashIndex = photo.fileName.lastIndexOf('/');
          photo.fileName = photo.fileName.substring(0, slashIndex + 1) +
           'th_' +
           photo.fileName.substring(slashIndex + 1, photo.fileName.length);
          return photo;
        }
      }
    });
    console.log(photos);
    res.render('transaction/cart',
        {
          cart: cart,
          photos: photos,
        });
  }).catch((err) => {
    res.redirect('/');
    console.error(err);
  });
});

export default router;
