/* ./routes/rates-fees.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const ratesFees = [
    {
      title: 'The Course',
      image: 9,
      rates: [
        {
          desc: '9 Hole',
          price: '$25'
        },
        {
          desc: '9 Hole - Senior',
          price: '$20'
        },
        {
          desc: '9 Hole - Junior',
          price: '$15'
        },
        {
          desc: '18 Hole',
          price: '$36'
        },
        {
          desc: '18 Hole - Senior',
          price: '$28'
        },
        {
          desc: '18 Hole - Junior',
          price: '$23'
        }
      ]
    },
    {
      title: 'Driving Range',
      image: 15,
      rates: [
        {
          desc: 'S Bucket - 25 Balls',
          price: '$3.50'
        },
        {
          desc: 'M Bucket - 50 Balls',
          price: '$7'
        },
        {
          desc: 'L Bucket - 75 Balls',
          price: '$10.50'
        },
        {
          desc: 'XL Bucket - 100 Balls',
          price: '$14'
        },
        {
          desc: 'Grass Tee Box',
          price: '$3'
        }
      ]
    },
    {
      title: 'Amenities',
      image: 6,
      rates: [
        {
          desc: 'Rental Set',
          price: '$12'
        },
        {
          desc: 'Pull Cart',
          price: '$5'
        },
        {
          desc: 'Recycled Balls (6 Pack)',
          price: '$5'
        },
        {
          desc: 'Tees (15 Pack)',
          price: '$1'
        }
      ]
    }
  ];

  var body = {
    heroTitle: 'Rates & Fees',
    heroSubtitle: 'Affordable Golf for Every Player',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-2.jpg',
    ratesFees: ratesFees
  };
  // render the page
  res.render('rates-fees', body);
});

module.exports = router;
