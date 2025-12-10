import express from "express";
import { validationResult } from "express-validator";
import createError from "http-errors";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/allValidator.js";
import { checkCompanyId } from "../model/model.company.js";
import {
  createUser,
  getCompanyCodeByUsername,
  userCheck,
} from "../model/model.user.js";
import { regenerateSession } from "../middlewares/regenerateSession.js";

const router = express.Router();

router.post("/register", validateRegister, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        createError(422, "輸入資料驗證錯誤", { errors: errors.array() }) // Invalidated user data input
      );
    }
    const { username, password, companyId } = req.body;
    await checkCompanyId(companyId);
    const newUser = await createUser({ username, password, companyId });

    res.status(201).json({
      message: "使用者註冊成功", // User regist success
      user: newUser.username,
      companyId: newUser.companyId,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        createError(422, "輸入資料驗證錯誤", { errors: errors.array() }) // Invalidated user data input
      );
    }
    const { username, password } = req.body;
    const user = await userCheck({ username, password });
    const companyCode = await getCompanyCodeByUsername({ username });
    await regenerateSession(req, (s) => {
      s.userId = user.id;
      s.username = user.username;
      s.companyCode = companyCode;
    });
    console.log("After regenerateSession:", req.sessionID);
    // req.session.userId = user.id;
    res.status(200).json({
      message: "User login success",
      username: user.username,
      companyCode: companyCode,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  console.log(`Session ID from req.sessionID: ${req.sessionID}`);
  if (!req.session || !req.session.userId) {
    return res.status(200).json({ message: "使用者本來就未登入" });
  }

  console.log(`Logging out session ID: ${req.sessionID}`);
  req.session.destroy((err) => {
    if (err) {
      // 如果銷毀 session 時出錯，將錯誤傳遞給錯誤處理中介軟體
      return next(createError(500, "無法登出，請稍後再試"));
    }
    // res.clearCookie("connect.sid");
    res.status(200).json({ message: "使用者登出成功" });
  });
});

router.get("/auth", (req, res, next) => {
  if (req.session.userId) {
    res.status(200).json({
      username: req.session.username,
      companyCode: req.session.companyCode,
    });
  } else {
    res.status(401).json({ message: "Not Authenticated" });
  }
});

export default router;
