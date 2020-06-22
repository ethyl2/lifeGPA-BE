exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('categories').then(function () {
    // Inserts seed entries
    return knex('categories').insert([
      { id: 1, title: 'Fitness' },
      { id: 2, title: 'Nutrition' },
      { id: 3, title: 'Education' },
      { id: 4, title: 'Relationships' },
      { id: 5, title: 'Career' },
      { id: 6, title: 'Mental Health' },
      { id: 7, title: 'Service' },
      { id: 8, title: 'Spirituality' },
      { id: 9, title: 'Finances' },
      { id: 10, title: 'Other' },
    ]);
  });
};
