/* ./routes/index.js */
const express = require('express');
const router = express.Router();
const getItems = require('../helper/dynamo-helper');

// const get12Hr = time => {
//     const [hours, mins] = time.split(':');
//     return Number(hours) > 12 ? `${Number(hours) - 12}:${mins}` : time;
// }

router.get('/', async function (req, res) {

    // const openQuery = { tableName: 'cedar-groves-hours', keyName: 'type', keyType: 'S', keyValue: 'open' };
    // const openHour = await getItems(openQuery);

    // const closeQuery = { tableName: 'cedar-groves-hours', keyName: 'type', keyType: 'S', keyValue: 'close' };
    // const closeHour = await getItems(closeQuery);

    var body = {
        hero_title: 'Cedar Groves Executive<br>Par 3 & Driving Range',
        hero_subtitle: 'Golf Course & Driving Range',
        hero_img: 'assets/images/drone-1.jpg',
        // open_hour: get12Hr(openHour.hour.S),
        // close_hour: get12Hr(closeHour.hour.S)
    };
    // render the page
    res.render('index', body);
});

module.exports = router;