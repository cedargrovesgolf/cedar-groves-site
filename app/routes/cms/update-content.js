const express = require('express');
const router = express.Router();
const { updateItem } = require('../../helper/dynamo-helper');

router.post('/', async (req, res) => {
  const { openHour, closeHour, closed: isClosed } = req.body;

  if (!isClosed && !openHour && !closeHour) {
    return res.redirect('/admin-cms?success=-1');
  }

  const baseQuery = {
    tableName: 'cedar-groves-hours',
    keyName: 'type',
    keyType: 'S',
    valueName: 'hour'
  };

  const openQuery =
    isClosed || !openHour
      ? { ...baseQuery, keyValue: 'open', valueType: 'NULL', value: true }
      : { ...baseQuery, keyValue: 'open', valueType: 'S', value: openHour };

  const closeQuery =
    isClosed || !closeHour
      ? { ...baseQuery, keyValue: 'close', valueType: 'NULL', value: true }
      : { ...baseQuery, keyValue: 'close', valueType: 'S', value: closeHour };

  try {
    await Promise.all([updateItem(openQuery), updateItem(closeQuery)]);
    return res.redirect('/admin-cms?success=1');
  } catch (err) {
    console.error(err);
    return res.redirect('/admin-cms?success=0');
  }
});

module.exports = router;
