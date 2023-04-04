/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    var body = {
        hero_title: 'Contact Us',
        hero_subtitle: 'Let Us Know How We Can Help',
        hero_img: 'assets/images/drone-20.jpg',
    };
    // render the page
    res.render('contact', body);
});

module.exports = router;