exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          username: 'llama',
          name: 'Lana Llama',
          email: 'llama@gmail.com',
          password:
            '$2a$12$NCv3dEyStfcWxnEqfnnP7.oVa0VOGh35beCax61.JxSnGUOgs6Dke',
        },
        {
          id: 2,
          username: 'coyote',
          name: 'Cody Coyote',
          email: 'coyote@gmail.com',
          password:
            '$2a$12$r.5mwq0rVyMbzV2ag0ZsoeIoBNJiEr6UH05StAc2CeyonuWFXlseG',
        },
        {
          id: 3,
          username: 'spider',
          name: 'Samson Spider',
          email: 'spider@gmail.com',
          password:
            '$2a$12$I/LfcvapAXVYUu7lUO.rzOE7EBiKtPewOwdBorereGIzo1QubZSXi',
        },
      ]);
    });
};
