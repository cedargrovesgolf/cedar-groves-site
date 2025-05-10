/* ./routes/index.js */
const express = require('express');
const router = express.Router();
const { getItem } = require('../helper/dynamo-helper');

const get12Hr = time => {
  if (!time) {
    return null;
  }
  const [hours, mins] = time.split(':');
  const isPm = Number(hours) >= 12;
  const formatHrs = Number(hours) % 12 || 12;
  return {
    time: `${formatHrs}:${mins}`,
    ampm: isPm ? 'pm' : 'am'
  };
};

router.get('/', async (req, res) => {
  const baseQuery = {
    tableName: 'cedar-groves-hours',
    keyName: 'type',
    keyType: 'S'
  };
  
  const openHour = await getItem({ ...baseQuery, keyValue: 'open' });
  const closeHour = await getItem({ ...baseQuery, keyValue: 'close' });
  const overrideMsg = await getItem({ ...baseQuery, keyValue: 'override' });

  const reviews = [
    {
      review:
        'I love this course, the people who work there are friendly and the course is great. I love the lay out and it has helped my my chip game a ton.',
      author: 'Allan Shephard',
      stars: 5
    },
    {
      review:
        'By far the most executive par 3 I have ever played. Best greens in the city and the tee boxes were very well maintained. I took my boss for a quick 9 after work and got a raise out of it.',
      author: 'Carson Dorcas',
      stars: 5
    },
    {
      review:
        'Awesome place. Great staff. Ample tee areas. Great putting green. The only thing you really need is ice cream!',
      author: 'D Conzie Connell',
      stars: 5
    },
    {
      review:
        "A nice, challenging par 3 course. Greens are in good shape for how little rain we've had this year. Tee boxes have taken a beating, but is a lot of fun for the price!",
      author: 'Matthew Chase',
      stars: 4
    },
    {
      review: 'A great par 3 course, we are here every week.',
      author: 'Robert Brennan',
      stars: 5
    },
    {
      review:
        'More challenging than I anticipated, which is great. I also loved that there was a recycling bin at each hole. *Patrons... please be courteous and use them!*',
      author: 'Denise Hutton',
      stars: 5
    },
    {
      review:
        'A great place to spend some time practicing on the driving range or the putting green. Very reasonably priced and the staff was friendly.',
      author: 'Brent',
      stars: 4
    },
    {
      review:
        'This is a great par 3 course with the chance to open up with your driver a few times',
      author: 'Mike Davidson',
      stars: 5
    },
    {
      review:
        'Laid out well, staff is friendly. May be an executive par 3, but it has its challenges. This course will test your irons.',
      author: 'Joe Cruise',
      stars: 5
    },
    {
      review:
        'Great 9 hole course with some excellent hazards to make it challenging.',
      author: 'Mike Goddard',
      stars: 4
    }
  ];

  var body = {
    heroTitle: 'Cedar Groves Executive<br>Par 3 & Driving Range',
    heroSubtitle: 'Golf Course & Driving Range',
    heroImg: 'https://cedar-groves-assets.s3.us-east-2.amazonaws.com/images/drone-1.jpg',
    openHour: openHour && openHour.hour ? get12Hr(openHour.hour.S) : null,
    closeHour: closeHour && closeHour.hour ? get12Hr(closeHour.hour.S) : null,
    overrideMsg: overrideMsg && overrideMsg.hour ? overrideMsg.hour.S : null,
    reviews: reviews
  };
  // render the page
  res.render('index', body);
});

module.exports = router;
