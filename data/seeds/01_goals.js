exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('goals').then(function () {
    // Inserts seed entries
    return knex('goals').insert([
      { title: 'Walk', description: 'Go on a walk each day.' },
      {
        title: 'Workout',
        description: 'Attend a fitness class or do a fitness routine or video.',
      },
      {
        title: 'Stretch',
        description:
          'Get up and stretch every half hour while working at a desk.',
      },
      {
        title: 'Fruits',
        description: 'Eat more than one serving of fruits.',
      },
      {
        title: 'Veggies',
        description: 'Eat more than one serving of vegetables',
      },
      {
        title: 'Vitamins',
        description: 'Take recommended vitamins and supplements.',
      },
      { title: 'Breakfast', description: 'Remember to eat breakfast.' },
      { title: 'Read', description: 'Read for at least 20 min.' },
      {
        title: 'Foreign Language',
        description: 'Practice a foreign language.',
      },
      {
        title: 'Journal',
        description: 'Write in a journal/diary/blog or create a vlog entry.',
      },
      { title: 'Thank', description: 'Write a thank-you note or text.' },
      { title: 'Positivity', description: 'Write/say a positive comment.' },
      { title: 'Hug', description: 'Give at least one hug.' },
      {
        title: 'Something New',
        description: 'Learn about a new concept or application.',
      },
      { title: 'Punctuality', description: 'Be early or on time to work.' },
      { title: 'Relationships', description: 'Get to know someone better.' },
    ]);
  });
};
