import express from "express";
import {
  busSN_ID_Check,
  getAllStoredData,
  deleteSN_ID,
  saveCrtf,
  getCrtfDataByAdmin,
  getCrtfDataByUser,
  saveCrtfMany,
} from "../model/model.crtfData.js";
import { checkUserId, getUserRole } from "../model/model.user.js";

const router = express.Router();

router.post("/save-crtf", async (req, res, next) => {
  try {
    const { data } = req.body;
    const user = {
      id: req.session.userId,
      username: req.session.username,
      companyCode: req.session.companyCode,
    };

    const checkResult = await busSN_ID_Check({ data, user });
    let searchPrefix = [];
    if (checkResult.BUS_SN && checkResult.BUS_ID && checkResult.both) {
      searchPrefix = [`${data.BUS_SN}_${data.BUS_ID}`, null];
    } else if (checkResult.BUS_SN && checkResult.BUS_ID && !checkResult.both) {
      searchPrefix = [`${data.BUS_SN}_`, `${data.BUS_ID}_`];
    } else if (!checkResult.BUS_SN && checkResult.BUS_ID && !checkResult.both) {
      searchPrefix = [`${data.BUS_ID}_`, null];
    } else if (checkResult.BUS_SN && !checkResult.BUS_ID && !checkResult.both) {
      searchPrefix = [`${data.BUS_SN}_`, null];
    }
    const deleteResult = await deleteSN_ID({ searchPrefix, user });

    const result = await saveCrtf({ data, user });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/get-all-stored-data", async (req, res, next) => {
  try {
    const user = {
      userId: req.session.userId,
      companyCode: req.session.companyCode,
    };
    const allStoredData = await getAllStoredData({ user });
    res.status(200).json(allStoredData);
  } catch (err) {
    next(err);
  }
});

router.get("/get-crtf-data", async (req, res, next) => {
  try {
    const user = {
      userId: req.session.userId,
      companyCode: req.session.companyCode,
    };
    const userRole = await getUserRole({ user });
    if (!userRole) {
      throw createError(404, "User not found");
    }
    let result = null;
    if (userRole === "ADMIN") {
      result = await getCrtfDataByAdmin();
    } else if (userRole === "USER") {
      result = await getCrtfDataByUser({ user });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/save-import-crtf", async (req, res, next) => {
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
    const result = await saveCrtfMany({ data, user });
    res.status(200).json({
      message: "New CRTFs created successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
