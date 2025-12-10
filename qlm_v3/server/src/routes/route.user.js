import express from "express";
import {
  checkUserId,
  createUser,
  createUserMany,
  getAllUserFunctionality,
  getAllUsername,
  getUserData,
  saveUserData,
  saveUserPassword,
} from "../model/model.user.js";

const router = express.Router();

router.get("/get-user-data", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const userData = await getUserData({ user });
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
});

router.post("/save-user-data", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const userInputData = req.body;
    const updatedUserData = await saveUserData({ user, userInputData });
    res.status(200).json(updatedUserData);
  } catch (err) {
    next(err);
  }
});

router.post("/save-user-password", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const userInputPasswordData = req.body;
    const updatedUserPasswordData = await saveUserPassword({
      user,
      userInputPasswordData,
    });
    res.status(200).json(updatedUserPasswordData);
  } catch (err) {
    next(err);
  }
});

router.get("/get-all-user-functionality", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const allUserFunctionality = await getAllUserFunctionality({ user });
    res.status(200).json(allUserFunctionality);
  } catch (err) {
    next(err);
  }
});

router.get("/get-all-username", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const allUser = await getAllUsername({ user });
    res.status(200).json(allUser);
  } catch (err) {
    next(err);
  }
});

router.post("/save-new-user", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const {
      USERNAME: username,
      PASSWORD: password,
      COMPANY_ID: companyId,
    } = req.body.newUserData;
    const isAuthorized = await checkUserId({ user });
    if (!isAuthorized) {
      return res.status(403).json({
        message:
          "Permission denied. You are not authorized to create a new user.",
      });
    }
    const newUser = await createUser({ username, password, companyId });
    res.status(201).json({
      message: "New user created successfully.",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/save-import-user", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId, username: req.session.username };
    const isAuthorized = await checkUserId({ user });
    if (!isAuthorized) {
      return res.status(403).json({
        message:
          "Permission denied. You are not authorized to create a new user.",
      });
    }
    const { data } = req.body;
    const result = await createUserMany({ data, user });

    res.status(201).json({
      message: "New users created successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
