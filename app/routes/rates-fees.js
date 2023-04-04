/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    var body = {
        hero_title: 'Rates & Fees',
        hero_subtitle: 'Affordable Golf for Every Player',
        hero_img: 'assets/images/drone-2.jpg',
    };
    // render the page
    res.render('rates-fees', body);
});

module.exports = router;