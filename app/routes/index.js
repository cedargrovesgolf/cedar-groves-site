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

  var body = {
    heroTitle: 'Cedar Groves Executive<br>Par 3 & Driving Range',
    heroSubtitle: 'Golf Course & Driving Range',
    heroImg: 'assets/images/drone-1.jpg',
    openHour: get12Hr(openHour.hour.S),
    closeHour: get12Hr(closeHour.hour.S)
  };
  // render the page
  res.render('index', body);
});

module.exports = router;
