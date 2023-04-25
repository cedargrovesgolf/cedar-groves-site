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
  const { openHour, closeHour, overrideMsg, isClosed } = req.body;

  if (!isClosed && !openHour && !closeHour && !overrideMsg) {
    req.session.updateError =
      'Please update the hours, provide an override message, or select "CLOSED" to update.';
    return res.redirect('/admin-cms');
  }

  try {
    await Promise.all([
      updateHours('open', openHour, isClosed),
      updateHours('close', closeHour, isClosed),
      updateHours('override', overrideMsg, isClosed)
    ]);
    req.session.updateSuccess = overrideMsg
      ? 'Message updated succuessfully!'
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

module.exports = router;
