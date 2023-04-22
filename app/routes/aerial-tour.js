/* ./routes/aerial-tour.js */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  var body = {
    heroTitle: 'Aerial Tour',
    heroSubtitle: 'Take Your Swing to New Heights',
    heroImg: 'assets/images/drone-8.jpg'
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
        desc: 'Arrive tucked in the woods, surrounded by large trees, and staring down a stunning fairway. On the edge of hole 9, this hole presents a unique obstacle with trees situated in the fairway. Enjoy the natural surroundings and nature of this hole.'
      },
      3: {
        hole: 3,
        yardage: [75, 126, 132],
        par: 3,
        desc: "This Par 3 is deceptively challenging. Featuring a narrow, straight fairway and a small green that demands precision and a soft touch. Despite it's flat terrain and straightforward layout, golfers will need to bring their best game to score well on this seemingly simple hole."
      },
      4: {
        hole: 4,
        yardage: [64, 155, 170],
        par: 3,
        desc: 'Start this hole over the water with a thrilling experience. The green is slightly elevated, requiring a strong tee shot to avoid trees and water hazards. With stunning views and challenging obstacles, hole 4 is a standout on the course.'
      },
      5: {
        hole: 5,
        yardage: [95, 115, 130],
        par: 3,
        desc: 'Hole 5 is short, fun to play, with a straight fairway and water hazards. Surrounded by trees, golfers must hit an accurate shot over the water to reach the slightly sloped green. Be careful not to hit your shot too far left or right, as the surrounding trees can easily catch a wayward ball.'
      },
      6: {
        hole: 6,
        yardage: [46, 95, 120],
        par: 3,
        desc: "This hole is a hidden gem, featuring an elevated tee that provides stunning panoramic views of the surrounding landscape, and an alluring island green that is connected to the fairway by a quaint wooden bridge. It's a challenging yet rewarding hole that offers golfers an unforgettable experience."
      },
      7: {
        hole: 7,
        yardage: [135, 265, 270],
        par: 4,
        desc: 'Hole 7 is one of the longest holes on the course, offering a challenging Par 4 experience. With an elevated green and a breathtaking fairway, this straight hole requires a well-placed drive to set up a solid approach shot. '
      },
      8: {
        hole: 8,
        yardage: [180, 265, 275],
        par: 4,
        desc: 'This Par 4 offers a birdie opportunity for those who can navigate the landscape. From the elevated tee deck, appreciate a shot over the valley through the narrow fairway and the surrounding trees. Test your long range game, and enjoy the calming scenery while playing this hole.'
      },
      9: {
        hole: 9,
        yardage: [116, 160, 165],
        par: 3,
        desc: "The 9th hole, a longer Par 3, presents golfers with a challenging finish to the course. The green is well-kept and rewards accurate tee shots. Whether looking to finish strong or just soak in the beauty of the course, this hole won't disappoint."
      }
    };

    body = {
      ...body,
      ...holeInfo[hole],
      url: `hole-${hole}.mov`
    };
  } else {
    body = {
      ...body,
      holeNav: [
        'assets/images/drone-1.jpg',
        'assets/images/drone-17.jpg',
        'assets/images/drone-21.jpg',
        'assets/images/drone-20.jpg',
        'assets/images/drone-7.jpg',
        'assets/images/drone-5.jpg',
        'assets/images/drone-9.jpg',
        'assets/images/drone-11.jpg',
        'assets/images/drone-12.jpg'
      ]
    };
  }
  // render the page
  res.render('aerial-tour', body);
});

module.exports = router;
