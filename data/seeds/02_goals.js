exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('goals').then(function () {
    // Inserts seed entries
    return knex('goals').insert([
      { title: 'Walk', description: 'Go on a walk each day.' },
      {
        title: 'Workout',
        description: 'Attend a fitness class or do a fitness routine or video.',
        category_id: 1,
      },
      {
        title: 'Stretch',
        description:
          'Get up and stretch every half hour while working at a desk.',
        category_id: 1,
      },
      {
        title: 'Fruits',
        description: 'Eat more than one serving of fruits.',
        category_id: 2,
      },
      {
        title: 'Veggies',
        description: 'Eat more than one serving of vegetables',
        category_id: 2,
      },
      {
        title: 'Vitamins',
        description: 'Take recommended vitamins and supplements.',
        category_id: 2,
      },
      {
        title: 'Breakfast',
        description: 'Remember to eat breakfast.',
        category_id: 2,
      },
      {
        title: 'Read',
        description: 'Read for at least 20 min.',
        category_id: 3,
      },
      {
        title: 'Foreign Language',
        description: 'Practice a foreign language.',
        category_id: 3,
      },
      {
        title: 'Journal',
        description: 'Write in a journal/diary/blog or create a vlog entry.',
        category_id: 3,
      },
      {
        title: 'Thank',
        description: 'Write a thank-you note or text.',
        category_id: 4,
      },
      {
        title: 'Spread Positivity',
        description: 'Write/say a positive comment.',
        category_id: 4,
      },
      { title: 'Hug', description: 'Give at least one hug.', category_id: 4 },
      {
        title: 'Something New',
        description: 'Learn about a new concept or application.',
        category_id: 3,
      },
      {
        title: 'Punctuality',
        description: 'Be early or on time to work.',
        category_id: 5,
      },
      {
        title: 'Relationships',
        description: 'Get to know someone better.',
        category_id: 4,
      },
    ]);
  });
};
