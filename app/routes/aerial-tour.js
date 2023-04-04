/* ./routes/aerial-tour.js */
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    var body = {
        hero_title: 'Aerial Tour',
        hero_subtitle: 'Take Your Swing to New Heights',
        hero_img: 'assets/images/drone-8.jpg',
    };

    let hole = req.query.hole;
    if (typeof hole !== 'undefined') {
        let holeInfo = {
            1: {
                hole: 1,
                yardage: [125, 155, 168],
                par: 3,
                desc: 'Tee off high above Dolan Lake on this picturesque opening hole. With a small pond obstacle in play, accuracy and finesse are key to reaching the green on this hole. Surrounded by trees, this hole offers a peaceful yet demanding start to your round.'
            },
            2: {
                hole: 2,
                yardage: [75, 115, 125],
                par: 3,
                desc: 'This hole is tucked in the woods, surrounded by large trees, and features a stunning fairway. Located beside Hole 9, this hole presents a unique obstacle with trees situated in the fairway. Enjoy the natural surroundings of this hole and use them to your advantage to score well.',
            },
            3: {
                hole: 3,
                yardage: [75, 126, 132],
                par: 3,
                desc: 'This Par 3 is deceptively challenging, featuring a narrow, straight fairway and a small green that demands precision and a soft touch. Despite its flat terrain and straightforward layout, golfers will need to bring their best game to score well on this seemingly simple hole.'
            },
            4: {
                hole: 4,
                yardage: [64, 155, 170],
                par: 3,
                desc: 'This is a hole',
            },
            5: {
                hole: 5,
                yardage: [95, 115, 130],
                par: 3,
                desc: 'This is a hole',
            },
            6: {
                hole: 6,
                yardage: [46, 95, 120],
                par: 3,
                desc: 'This is a hole',
            },
            7: {
                hole: 7,
                yardage: [135, 265, 270],
                par: 4,
                desc: 'This is a hole',
            },
            8: {
                hole: 8,
                yardage: [180, 265, 275],
                par: 4,
                desc: 'This is a hole',
            },
            9: {
                hole: 9,
                yardage: [116, 160, 165],
                par: 3,
                desc: 'This is a hole',
            }
        };

        body = {
            ...body,
            ...holeInfo[hole],
            url: `hole-${hole}.mov`
        };
    }

    // render the page
    res.render('aerial-tour', body);
});

module.exports = router;
