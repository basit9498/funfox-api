const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { body, param } = require('express-validator');
const GroupTaskController = require('../controllers/grouptask.controller');

const route = express.Router();

// create group task
route.post(
  '/task',
  isAuth,
  [
    body('name', `'Name' should at least 3 characters`)
      .isLength({ min: 3 })
      .trim(),
    body('description', `'description' should at least 3 characters`)
      .isLength({ min: 3 })
      .trim(),
    body('group_id', `'group_id' group_id is not valid `).isMongoId(),
  ],
  GroupTaskController.createGroupTask
);

// get group tasks
route.get(
  '/:id/task',
  isAuth,
  [param('id', `'id' group_id is not valid `).isMongoId()],
  GroupTaskController.getGroupTasks
);

// get group tasks complete
route.put(
  '/:id/task/:tid/complete',
  isAuth,
  [
    param('id', `'id' Group id is not valid `).isMongoId(),
    param('tid', `'tid' Task id is not valid `).isMongoId(),
  ],
  GroupTaskController.getGroupTaskComplete
);

// get group tasks delete
route.delete(
  '/:id/task/:tid',
  isAuth,
  [
    param('id', `'id' Group id is not valid `).isMongoId(),
    param('tid', `'tid' Task id is not valid `).isMongoId(),
  ],
  GroupTaskController.getGroupTaskDelete
);

module.exports = route;
