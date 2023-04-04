/* ./routes/index.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    var body = {
        hero_title: 'Cedar Groves Executive<br>Par 3 & Driving Range',
        hero_subtitle: 'Golf Course & Country Club',
        hero_img: 'assets/images/drone-1.jpg',
    };
    // render the page
    res.render('index', body);
});

module.exports = router;