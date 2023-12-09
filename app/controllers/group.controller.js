const { validationResult } = require('express-validator');
const GroupModel = require('../models/group.model');
const UserModel = require('../models/user.model');
const mongoose = require('mongoose');
// create group
module.exports.createGroup = async (req, res, next) => {
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
    const { name } = req.body;

    const group = await new GroupModel({ name: name, owner_id: req.userId });
    await group.save();

    res.status(200).json({
      message: 'Group has been created',
      group: group,
    });
  } catch (err) {
    next(err);
  }
};

// get group
module.exports.getGroup = async (req, res, next) => {
  try {
    const group = await GroupModel.find({
      $or: [{ owner_id: req.userId }, { users: req.userId }],
    })
      .populate({ path: 'owner_id', select: 'name email' })
      .populate({ path: 'users', select: 'name email' });
    // const userId = new mongoose.Types.ObjectId(req.userId);
    // const group = await GroupModel.aggregate([
    //   {
    //     $match: {
    //       $or: [{ owner_id: userId }, { users: userId }],
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'owner_id',
    //       foreignField: '_id',
    //       as: 'owner',
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'users',
    //       foreignField: '_id',
    //       as: 'members',
    //     },
    //   },
    // ]);
    res.status(200).json({
      message: 'Groups',
      group: group,
    });
  } catch (err) {
    next(err);
  }
};

// invite user in  group
module.exports.inviteUserGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (userId === req.userId) {
      const error = new Error('You are  the Admin of this group ');
      error.status = 404;
      throw error;
    }

    const group = await GroupModel.updateOne(
      { _id: id },
      {
        $push: { users: userId },
      }
    );

    if (!group.modifiedCount) {
      const error = new Error('User not add in group');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: 'User invited successfully',
    });
  } catch (err) {
    next(err);
  }
};

// invite user in  group
module.exports.listUserGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    //  get All User
    const allUser = await UserModel.find({ _id: { $ne: req.userId } });
    if (!allUser) {
      const error = new Error('User not Founded');
      error.status = 404;
      throw error;
    }

    const group = await GroupModel.findById(id);

    if (!group) {
      const error = new Error('User not Founded');
      error.status = 404;
      throw error;
    }
    const userList = [];
    allUser.forEach((uf) => {
      if (!group.users.some((us) => us.toString() === uf._id.toString())) {
        userList.push(uf);
      }
    });

    res.status(200).json({
      message: 'User List',
      userList: userList,
    });
  } catch (err) {
    next(err);
  }
};

// user
// invite user in  group
module.exports.singleUserGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    //  get All User
    const user = await UserModel.findById(id);
    if (!user) {
      const error = new Error('User not Founded');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: 'User',
      user: user,
    });
  } catch (err) {
    next(err);
  }
};
