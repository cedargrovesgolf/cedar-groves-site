/* ./routes/cms/update-config.js */
const express = require('express');
const router = express.Router();
const { updateItem } = require('../../helper/dynamo-helper');

const baseQuery = {
  tableName: 'cedar-groves-hours',
  keyName: 'type',
  keyType: 'S'
};

const hoursBaseQuery = {
  ...baseQuery,
  valueName: 'hour'
};

const configBaseQuery = {
  ...baseQuery,
  valueName: 'data',
  valueType: 'S'
};

/* Hours */

const updateHour = async (hourType, hourValue, isClosed) => {
  const query = {
    ...hoursBaseQuery,
    keyValue: hourType,
    valueType: isClosed ? 'NULL' : 'S',
    value: isClosed ? true : hourValue
  };

  await updateItem(query);
};

router.post('/hours', async (req, res) => {
  const { openHour, closeHour, overrideMsg, isClosed } = req.body;

  if (!isClosed && !openHour && !closeHour && !overrideMsg) {
    req.session.updateError =
      'Please update the hours, provide an override message, or select "CLOSED" to update.';
    return res.redirect('/admin-cms');
  }

  try {
    await Promise.all([
      updateHour('open', openHour, isClosed),
      updateHour('close', closeHour, isClosed),
      updateHour('override', overrideMsg, isClosed)
    ]);
    req.session.updateSuccess = overrideMsg
      ? 'Message updated successfully!'
      : 'Hours updated successfully!';
    return res.redirect('/admin-cms');
  } catch (err) {
    console.error(err);
    req.session.updateError = overrideMsg
      ? 'There was an error when updating the override message.'
      : 'There was an error when updating the hours.';
    return res.redirect('/admin-cms');
  }
});

/* Season Year */

router.post('/season', async (req, res) => {
  const { year } = req.body;

  if (!year || !/^\d{4}$/.test(year)) {
    req.session.updateError = 'Please provide a valid 4-digit year.';
    return res.redirect('/admin-cms');
  }

  try {
    await updateItem({
      ...configBaseQuery,
      keyValue: 'season',
      value: JSON.stringify({ year })
    });
    req.session.updateSuccess = 'Season year updated successfully!';
    return res.redirect('/admin-cms');
  } catch (err) {
    console.error(err);
    req.session.updateError = 'There was an error when updating the season year.';
    return res.redirect('/admin-cms');
  }
});

/* Rates & Fees */

const rateKeys = [
  'course_9hole', 'course_9hole_senior', 'course_9hole_junior',
  'course_18hole', 'course_18hole_senior', 'course_18hole_junior',
  'range_s', 'range_m', 'range_l', 'range_xl', 'range_grass',
  'amenity_rental', 'amenity_pullcart', 'amenity_balls', 'amenity_tees',
  'amenity_water', 'amenity_gatorade', 'amenity_snacks'
];

router.post('/rates', async (req, res) => {
  const rates = {};

  for (const key of rateKeys) {
    const value = req.body[key];
    if (!value || isNaN(parseFloat(value))) {
      req.session.updateError = 'All rate fields must be valid numbers.';
      return res.redirect('/admin-cms');
    }
    rates[key] = value;
  }

  try {
    await updateItem({
      ...configBaseQuery,
      keyValue: 'rates',
      value: JSON.stringify(rates)
    });
    req.session.updateSuccess = 'Rates updated successfully!';
    return res.redirect('/admin-cms');
  } catch (err) {
    console.error(err);
    req.session.updateError = 'There was an error when updating the rates.';
    return res.redirect('/admin-cms');
  }
});

/* Memberships */

router.post('/memberships', async (req, res) => {
  const { seasonPass, tenRoundPass } = req.body;

  if (!seasonPass || isNaN(parseFloat(seasonPass)) ||
      !tenRoundPass || isNaN(parseFloat(tenRoundPass))) {
    req.session.updateError = 'All membership prices must be valid numbers.';
    return res.redirect('/admin-cms');
  }

  try {
    await updateItem({
      ...configBaseQuery,
      keyValue: 'memberships',
      value: JSON.stringify({ seasonPass, tenRoundPass })
    });
    req.session.updateSuccess = 'Membership prices updated successfully!';
    return res.redirect('/admin-cms');
  } catch (err) {
    console.error(err);
    req.session.updateError = 'There was an error when updating the membership prices.';
    return res.redirect('/admin-cms');
  }
});

module.exports = router;
