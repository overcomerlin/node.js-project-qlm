import express from "express";
import {
  getFields,
  getModuleFields,
  getPrintTune,
  getPublishModeFields,
  saveFuncSwitch,
  savePrintTune,
} from "../model/model.userInfo.js";

const router = express.Router();

router.get("/get-fields", async (req, res, next) => {
  try {
    const username = req.session.username;
    const fields = await getFields({ username });
    res.status(200).json(fields);
  } catch (err) {
    next(err);
  }
});

router.get("/get-publish-mode-fields", async (req, res, next) => {
  try {
    const username = req.session.username;
    const publishModeFields = await getPublishModeFields({ username });
    res.status(200).json(publishModeFields);
  } catch (err) {
    next(err);
  }
});

router.get("/get-print-tune", async (req, res, next) => {
  try {
    const username = req.session.username;
    const printTune = await getPrintTune({ username });
    res.status(200).json(printTune);
  } catch (err) {
    next(err);
  }
});

router.get("/get-module-fields", async (req, res, next) => {
  try {
    const username = req.session.username;
    const moudleFields = await getModuleFields({ username });
    res.status(200).json(moudleFields);
  } catch (err) {
    next(err);
  }
});

router.post("/save-print-tune", async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { sendPrintTuneData } = req.body;
    await savePrintTune({ userId, sendPrintTuneData });
    res.status(200).json({ message: "Print tune data saved successfully." });
  } catch (err) {
    next(err);
  }
});

router.post("/save-func-switch", async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const functionFields = req.body;
    await saveFuncSwitch({ userId, functionFields });
    res
      .status(200)
      .json({ message: "Function switch data saved successfully." });
  } catch (err) {
    next(err);
  }
});

export default router;
