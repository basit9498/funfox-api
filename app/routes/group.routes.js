const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { body, param } = require('express-validator');
const GroupController = require('../controllers/group.controller');

const route = express.Router();

// create group
route.post(
  '/',
  isAuth,
  [
    body('name', `'Name' should at least 3 characters`)
      .isLength({ min: 3 })
      .trim(),
  ],
  GroupController.createGroup
);

// get group
route.get('/', isAuth, GroupController.getGroup);

// invite user
route.put(
  '/:id/invite-user',
  isAuth,
  [
    body('userId', `'userId' userId is not valid`).isMongoId(),
    param('id', `'id' Group id is not valid `).isMongoId(),
  ],
  GroupController.inviteUserGroup
);

// user list
route.get(
  '/:id/user-list',
  isAuth,
  [param('id', `'id' Group id is not valid `).isMongoId()],
  GroupController.listUserGroup
);
// get single user detail
route.get(
  '/user/:id',
  isAuth,
  [param('id', `'id' Group id is not valid `).isMongoId()],
  GroupController.singleUserGroup
);

module.exports = route;
