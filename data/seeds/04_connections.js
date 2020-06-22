exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('connections').then(function () {
    // Inserts seed entries
    return knex('connections').insert([
      { user_id: 1, goal_id: 1 },
      { user_id: 1, goal_id: 3 },
      { user_id: 1, goal_id: 5 },
      { user_id: 1, goal_id: 7 },
      { user_id: 1, goal_id: 9 },
      { user_id: 1, goal_id: 11 },
      { user_id: 1, goal_id: 13 },
      { user_id: 2, goal_id: 1 },
      { user_id: 2, goal_id: 4 },
      { user_id: 2, goal_id: 8 },
      { user_id: 2, goal_id: 12 },
      { user_id: 2, goal_id: 16 },
      { user_id: 3, goal_id: 1 },
      { user_id: 3, goal_id: 5 },
      { user_id: 3, goal_id: 10 },
      { user_id: 3, goal_id: 15 },
    ]);
  });
};
