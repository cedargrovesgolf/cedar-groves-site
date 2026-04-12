/* ./routes/memberships.js */
const express = require('express');
const router = express.Router();
const { getMemberships, getSeasonYear } = require('../helper/config-helper');

router.get('/', async (req, res) => {
  const [memberships, seasonYear] = await Promise.all([
    getMemberships(),
    getSeasonYear()
  ]);

  var body = {
    heroTitle: 'Memberships',
    heroSubtitle: 'Join Our Community Today',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-22.jpg',
    seasonPass: memberships ? memberships.seasonPass : null,
    tenRoundPass: memberships ? memberships.tenRoundPass : null,
    seasonYear: seasonYear
  };
  // render the page
  res.render('memberships', body);
});

module.exports = router;
