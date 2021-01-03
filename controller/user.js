import express from 'express';
import axios from 'axios';
import User from '../model/user.js';

const router = new express.Router();

router.get('/login', (req, res) => {
  res.render('user/login');
});

router.get('/sign-up', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.render('user/sign-up',
        {});
  } else {
    res.redirect('/');
  }
});

router.post('/sign-up', (req, res) => {
  const user = req.session.user;
  if (!user) {
    const validation = {};
    const {username, email, password, confirmPassword} = req.body;
    if (!username || username === '') {
      validation.username = 'Username required';
      validation.error = true;
    }
    if (!email || email === '') {
      validation.email = 'Email required';
      validation.error = true;
    }
    if (!password || password === '') {
      validation.password = 'Password required';
      validation.error = true;
    }
    if (!confirmPassword || confirmPassword === '') {
      validation.confirmPassword = 'Confirm password';
      validation.error = true;
    }
    if ( password != confirmPassword) {
      validation.confirmPassword = 'Passwords don\'t match';
      validation.error = true;
    }
    if (validation.error) {
      console.log(validation);
      res.render('user/sign-up',
          {
            validationSign: validation,
            signUpValues: req.body,
          });
    } else {
      const url = `${process.env.URL}/users`;
      const newUser = new User(0, username, email, password);
      const json = newUser.getJson();
      axios.post(url, json)
          .then((response) => {
            res.render('user/login',
                {
                  message: 'Welcome. You may login now.',
                });
          }).catch((err) => {
            validation.email = 'Email or Username already registered';
            console.log(err);
            res.render('user/sign-up',
                {
                  validationSign: validation,
                  signUpValues: req.body,
                });
          });
    }
  } else {
    res.redirect('/');
  }
});

router.get('/account', (req, res) => {
  const user = req.session.user;
  if (user) {
    const url = `${process.env.URL}/users/${user.id}`;
    axios.get(url, {headers: {'Authorization': user.token}}).then((response) => {
      const photos = response.data.photos.map((photo) => {
        /** Replace picture by its thumbnail */
        const slashIndex = photo.fileName.lastIndexOf('/');
        photo.fileName = photo.fileName.substring(0, slashIndex + 1) +
         'th_' +
         photo.fileName.substring(slashIndex + 1, photo.fileName.length);
        return photo;
      });
      const {userName: username, boughtTransactions, soldTransactions} = response.data;
      const spent = boughtTransactions.reduce( (acc, cur) => acc + cur.listPrice, 0);
      const received = soldTransactions.reduce( (acc, cur) => acc + cur.listPrice, 0);
      const balance = received - spent;
      res.render('user/account',
          {
            spent: spent,
            earned: received,
            username: username,
            sold: soldTransactions,
            bought: boughtTransactions,
            balance: balance,
            photos: photos,
          });
    }).catch((err) => console.error(err));
  } else {
    res.redirect('/');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/login', (req, res) => {
  const url = `${process.env.URL}/login`;
  const {userEmail: email, password} = req.body;

  axios.post(url, {email: email, password: password})
      .then((response) => {
        const token = response.headers.authorization;
        const user = {email: email, logged: true, token: token};
        req.session.user = user;
        axios.get(`${process.env.URL}/users/email?value=${email}`,
            {headers: {'Authorization': token}})
            .then((response) => {
              req.session.user.id = response.data.id;
              req.session.user.username = response.data.userName;
              res.redirect('/account');
            }).catch((err) => {
              console.error(err.status);
              console.error(err.error);
            });
      }).catch((err) => {
        console.error(err);
        const validation = {};
        validation.error = 'Invalid email or password';
        const input = {};
        input.email = email;
        input.password = password;
        res.render('user/login', {
          validation: validation,
          loginValues: input,
        });
      });
});

export default router;
