const { models } = require('../models/index');

//TODO: find out why Messages are not created!!!
export async function seedUsers(date) {
  await models.User.create(
    {
      id: 1,
      username: 'R2D2',
      priority: 1,
      email: 'r2d2@example.com',
      phone: '+1',
      password: process.env.BOT_1_PASS,
      role: 'bot',
      descript: 'twit: #bot; youtube:',
    },
  );
  await models.User.create(
    {
      id: 2,
      username: 'Well',
      priority: 2,
      email: 'iconn8@gmail.com',
      phone: '+1',
      password: process.env.USER_1_PASS,
      role: 'admin',
      descript: 'twit: #well; youtube:',
    },
  );

  await models.User.create(
    {
      id: 3,
      username: 'Alex',
      priority: 3,
      email: 'hello@alex.com',
      phone: '+1',
      password: process.env.USER_2_PASS,
      role: 'manager',
      descript: 'twit: #alex; youtube:',
    },
  );

  await models.User.create(
    {
      id: 4,
      username: 'Oleg',
      priority: 4,
      email: 'hello@oleg.com',
      phone: '+1',
      password: process.env.USER_3_PASS,
      role: 'manager',
      descript: 'twit: #oleg; youtube:',
    },
  );

  await models.User.create(
    {
      id: 5,
      username: 'anonimous',
      priority: 99,
      email: 'anonimous@example.com',
      phone: '+1',
      password: "",
      role: 'customer',
      descript: 'anonimous desc',
    },
  );
};
