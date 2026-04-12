/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();
const { getRates, getSeasonYear } = require('../helper/config-helper');

function buildRatesFees(rates) {
  return [
    {
      title: 'The Course',
      image: 9,
      rates: [
        { desc: '9 Hole', price: `$${rates.course_9hole}` },
        { desc: '9 Hole - Senior', price: `$${rates.course_9hole_senior}` },
        { desc: '9 Hole - Junior', price: `$${rates.course_9hole_junior}` },
        { desc: '18 Hole', price: `$${rates.course_18hole}` },
        { desc: '18 Hole - Senior', price: `$${rates.course_18hole_senior}` },
        { desc: '18 Hole - Junior', price: `$${rates.course_18hole_junior}` }
      ]
    },
    {
      title: 'Driving Range',
      image: 15,
      rates: [
        { desc: 'S Bucket - 25 Balls', price: `$${rates.range_s}` },
        { desc: 'M Bucket - 50 Balls', price: `$${rates.range_m}` },
        { desc: 'L Bucket - 75 Balls', price: `$${rates.range_l}` },
        { desc: 'XL Bucket - 100 Balls', price: `$${rates.range_xl}` },
        { desc: 'Grass Tee Box', price: `$${rates.range_grass}` }
      ]
    },
    {
      title: 'Amenities',
      image: 6,
      rates: [
        { desc: 'Rental Set', price: `$${rates.amenity_rental}` },
        { desc: 'Pull Cart', price: `$${rates.amenity_pullcart}` },
        { desc: 'Recycled Balls (5 Pack)', price: `$${rates.amenity_balls}` },
        { desc: 'Tees (15 Pack)', price: `$${rates.amenity_tees}` },
        { desc: 'Water', price: `$${rates.amenity_water}` },
        { desc: 'Gatorade', price: `$${rates.amenity_gatorade}` },
        { desc: 'Chocolate Bars, Chips, Pop', price: `$${rates.amenity_snacks}` }
      ]
    }
  ];
}

router.get('/', async (req, res) => {
  const [rates, seasonYear] = await Promise.all([getRates(), getSeasonYear()]);

  var body = {
    heroTitle: 'Rates & Fees',
    heroSubtitle: 'Affordable Golf for Every Player',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-2.jpg',
    ratesFees: rates ? buildRatesFees(rates) : null,
    seasonYear: seasonYear
  };
  // render the page
  res.render('rates-fees', body);
});

module.exports = router;
