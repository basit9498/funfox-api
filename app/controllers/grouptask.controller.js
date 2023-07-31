const { validationResult } = require('express-validator');
const GroupTaskModel = require('../models/groupTask.model');

// create group
module.exports.createGroupTask = async (req, res, next) => {
  try {
    const validErrors = validationResult(req);

    if (!validErrors.isEmpty()) {
      const errorDetail = validErrors.array().map((error) => {
        return error.msg;
      });

      const error = new Error('Input Validation Error');
      error.detail = errorDetail;
      error.status = 422;
      throw error;
    }
    const { name, description, group_id } = req.body;

    const groupTask = await new GroupTaskModel({
      name: name,
      description: description,
      group_id: group_id,
    });
    await groupTask.save();

    res.status(200).json({
      message: 'Group Task has been created',
      groupTask: groupTask,
    });
  } catch (err) {
    next(err);
  }
};

// get group task
module.exports.getGroupTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const groupTask = await GroupTaskModel.find({ group_id: id });
    res.status(200).json({
      message: 'Group Tasks',
      tasks: groupTask,
    });
  } catch (err) {
    next(err);
  }
};

// get group task complete
module.exports.getGroupTaskComplete = async (req, res, next) => {
  try {
    const { id, tid } = req.params;
    const groupTask = await GroupTaskModel.findOne({ _id: tid, group_id: id });
    if (!groupTask) {
      const error = new Error('Task Not Founded');
      error.status = 404;
      throw error;
    }
    groupTask.is_complete = true;
    await groupTask.save();
    res.status(200).json({
      message: 'Group Tasks',
      tasks: groupTask,
    });
  } catch (err) {
    next(err);
  }
};

// get group task delete
module.exports.getGroupTaskDelete = async (req, res, next) => {
  try {
    const { id, tid } = req.params;
    const groupTask = await GroupTaskModel.deleteOne({
      _id: tid,
      group_id: id,
    });

    if (!groupTask.deletedCount) {
      const error = new Error('Task Not Founded');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Group Tasks Deleted',
    });
  } catch (err) {
    next(err);
  }
};
