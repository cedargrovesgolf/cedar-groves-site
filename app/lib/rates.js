export const rateSections = [
  {
    title: 'The Course',
    image: 9,
    rates: [
      ['9 Hole', 'course_9hole'],
      ['9 Hole - Senior', 'course_9hole_senior'],
      ['9 Hole - Junior', 'course_9hole_junior'],
      ['18 Hole', 'course_18hole'],
      ['18 Hole - Senior', 'course_18hole_senior'],
      ['18 Hole - Junior', 'course_18hole_junior']
    ]
  },
  {
    title: 'Driving Range',
    image: 15,
    rates: [
      ['S Bucket - 25 Balls', 'range_s'],
      ['M Bucket - 50 Balls', 'range_m'],
      ['L Bucket - 75 Balls', 'range_l'],
      ['XL Bucket - 100 Balls', 'range_xl'],
      ['Grass Tee Box', 'range_grass']
    ]
  },
  {
    title: 'Amenities',
    image: 6,
    rates: [
      ['Rental Set', 'amenity_rental'],
      ['Pull Cart', 'amenity_pullcart'],
      ['Recycled Balls (5 Pack)', 'amenity_balls'],
      ['Tees (15 Pack)', 'amenity_tees'],
      ['Water', 'amenity_water'],
      ['Gatorade', 'amenity_gatorade'],
      ['Chocolate Bars, Chips, Pop', 'amenity_snacks']
    ]
  }
]

export const rateKeys = rateSections.flatMap(section => section.rates.map(([, key]) => key))
