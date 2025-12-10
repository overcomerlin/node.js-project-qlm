import express from "express";
import {
  createCompany,
  createCompanyMany,
  getAllCompany,
} from "../model/model.company.js";
import { checkUserId } from "../model/model.user.js";

const router = express.Router();

router.get("/get-all-company", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const allCompany = await getAllCompany({ user });
    res.status(200).json(allCompany);
  } catch (err) {
    next(err);
  }
});

router.post("/save-new-company", async (req, res, next) => {
  try {
    const user = { userId: req.session.userId };
    const {
      COMPANY_CODE: companyCode,
      COMPANY_NAME: companyName,
      ADDRESS: address,
      TAX_ID: taxId,
      PHONE: phone,
    } = req.body.newCompanyData;
    const isAuthorized = await checkUserId({ user });
    if (!isAuthorized) {
      return res.status(403).json({
        message:
          "Permission denied. You are not authorized to create a new user.",
      });
    }
    const newCompany = await createCompany({
      companyCode,
      companyName,
      taxId,
      phone,
      address,
    });
    res
      .status(201)
      .json({ message: "Company created successfully", data: newCompany });
  } catch (err) {
    next(err);
  }
});

router.post("/save-import-company", async (req, res, next) => {
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
    const result = await createCompanyMany({ data, user });

    res.status(201).json({
      message: "New companies created successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
