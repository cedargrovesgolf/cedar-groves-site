/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    var body = {
        hero_title: 'Rules & Regulations',
        hero_subtitle: 'Your Guide to Our Course Regulations',
        hero_img: 'assets/images/drone-6.jpg',
    };
    // render the page
    res.render('rules-regulations', body);
});

module.exports = router;