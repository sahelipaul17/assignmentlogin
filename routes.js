const express = require('express');
const router = express.Router();

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;


router.get('/contact', (req, res) => {
  res.render('contact', {
    data: {},
    errors: {}
  });
});

router.post('/contact', (req, res) => {
  res.render('contact', {
    data: req.body, // { message, email }
    errors: {
      message: {
        msg: 'A message is required'
      },
      email: {
        msg: 'That email doesn‘t look right'
      }
    }
  });
});

const { check, validationResult, matchedData } = require('express-validator');

router.post('/contact', [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required'),
  check('email')
    .isEmail()
    .withMessage('That email doesn‘t look right')
], (req, res) => {
  const errors = validationResult(req);
  res.render('contact', {
    data: req.body,
    errors: errors.mapped()
  });
});

router.post('/contact', [
  check('message')
    .isLength({ min: 1 })
    .withMessage('Message is required')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('That email doesn‘t look right')
    .bail()
    .trim()
    .normalizeEmail()
], (req, res) => {
  const errors = validationResult(req);
  res.render('contact', {
    data: req.body,
    errors: errors.mapped()
  });

  const data = matchedData(req);
  console.log('Sanitized:', data);
});


router.post('/contact', [
  // validation ...
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('contact', {
      data: req.body,
      errors: errors.mapped()
    });
  }

  const data = matchedData(req);
  console.log('Sanitized: ', data);
  // Homework: send sanitized data in an email or persist to a db

  req.flash('success', 'Thanks for the message! I‘ll be in touch :)');
  res.redirect('/');
});

router.get('/contact', csrfProtection, (req, res) => {
  res.render('contact', {
    data: {},
    errors: {},
    csrfToken: req.csrfToken()
  });
});

router.post('/contact', csrfProtection, [
  // validations ...
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('contact', {
      data: req.body,
      errors: errors.mapped(),
      csrfToken: req.csrfToken()
    });
  }

  // ...
});


const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/contact', upload.single('photo'), csrfProtection, [
  // validation ...
], (req, res) => {
  // error handling ...

  if (req.file) {
    console.log('Uploaded: ', req.file);
    // Homework: Upload file to S3
  }

  req.flash('success', 'Thanks for the message! I’ll be in touch :)');
  res.redirect('/');
});