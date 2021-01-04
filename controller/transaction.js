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
});

router.get('/remove/:id', (req, res) => {
  let cart = req.session.cart;
  if (!cart) {
    cart = [];
  }
  let found = -1;
  let wasFound = false;
  // find the positions cart the element in the array
  for (let index = 0; index < cart.length && !wasFound; index++) {
    if (cart[index].id == req.params.id) {
      found = index;
      wasFound = true;
    }
  }
  if (found != -1) {
    cart.splice(found, 1);
  }
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/cart', (req, res) => {
  const cart = req.session.cart;
  const user = req.session.user;
  const url = `${process.env.URL}/photos/`;
  if (cart) {
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
      const total = photos.reduce( (acc, cur) => {
        return acc + cur.price;
      }, 0);
      res.render('transaction/cart',
          {
            username: user.username,
            email: user.email,
            size: cart.length,
            total: total,
            cart: cart,
            photos: photos,
            user: req.session.user,
          });
    }).catch((err) => {
      res.redirect('/');
      console.error(err);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/checkout', (req, res) => {
  const user = req.session.user;
  const cart = req.session.cart;
  if (user && cart) {
    // Decided not to include stripe payments for now
    // const {card, expire, cvv} = req.body;
    // console.log(card, expire , cvv);
    // const validation = {};
    // if (isNaN(card)) {
    //   validation.error = true;
    //   validation.card = 'Invalid card number';
    // }
    // if (isNaN(expire)) {
    //   validation.error = true;
    //   validation.card = 'Invalid Expiration number';
    // }
    // if (isNaN(cvv)) {
    //   validation.error = true;
    //   validation.card = 'Invalid CVV number';
    // }
    const url = `${process.env.URL}/transactions`;
    const token = req.session.user.token;
    /** Generates one promise per cart item */
    Promise.all( cart.map( (photo) => {
      const transaction = new Transaction(photo.id);
      const json = transaction.getJson();
      return axios.post(url, json, {headers: {'Authorization': token}});
    })).then( (response) => {
      req.session.cart = [];

      res.render('transaction/checked', {
        username: user.username,
      });
    }).catch( (error) => {
      console.log(error);
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

export default router;
