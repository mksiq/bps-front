import express from 'express';
const router = new express.Router();
import axios from 'axios';

router.get('/login', (req, res) => {
  res.render('user/login');
});

router.get('/sign-up', (req, res) => {
  res.render('user/sign-up',
      {});
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
      res.render('user/account',
          {
            photos: photos,
          });
    }).catch((err) => console.log(err));
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
              res.render('photo/public',
                  {
                    user: req.session.user,
                  });
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
