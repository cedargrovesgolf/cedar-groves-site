/* ./routes/cms/update-hours.js */
const express = require('express');
const router = express.Router();
const { updateItem } = require('../../helper/dynamo-helper');

const baseQuery = {
  tableName: 'cedar-groves-hours',
  keyName: 'type',
  keyType: 'S',
  valueName: 'hour'
};

const updateHours = async (hourType, hourValue, isClosed) => {
  const query = {
    ...baseQuery,
    keyValue: hourType,
    valueType: isClosed ? 'NULL' : 'S',
    value: isClosed ? true : hourValue
  };

  await updateItem(query);
};

router.post('/', async (req, res) => {
  const { openHour, closeHour, isClosed } = req.body;

  if (!isClosed && !openHour && !closeHour) {
    req.session.updateError =
      'Please update the hours or select "CLOSED" to update content.';
    return res.redirect('/admin-cms');
  }

  try {
    await Promise.all([
      updateHours('open', openHour, isClosed),
      updateHours('close', closeHour, isClosed)
    ]);
    req.session.updateSuccess = 'Hours updated successfully!';
    return res.redirect('/admin-cms');
  } catch (err) {
    console.error(err);
    req.session.updateError = 'There was an error when updating the hours.';
    return res.redirect('/admin-cms');
  }
});

module.exports = router;
