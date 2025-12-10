import { check } from "express-validator";

const validateCompanyId = [
  check("companyId")
    .exists({ checkFalsy: true })
    .withMessage("公司ID為必填欄位")
    .isInt({ min: 1 })
    .withMessage("公司ID必須為一個正整數")
    .toInt(),
];
const validateCompanyCode = [
  check("companyCode")
    .exists({ checkFalsy: true })
    .withMessage("公司代碼為必填欄位")
    .isAlphanumeric()
    .withMessage("公司代碼只能包含英文字母和阿拉伯數字") // Company code must contain only letters and numbers
    .trim()
    .escape(),
];
const validateCompanyName = [
  check("companyName")
    .exists()
    .withMessage("公司名稱為必填欄位，若沒有名稱請填『無』") // Company name is required, or "None" if it has no name
    .trim()
    .escape(),
];
const validateTaxId = [
  check("taxId")
    .optional({ values: "falsy" })
    .isNumeric()
    .withMessage("公司統編只能填數字")
    .isLength({ min: 8, max: 8 })
    .withMessage("公司統編只能8個數字")
    .trim()
    .escape(),
];
const validatePhone = [
  check("phone")
    .optional({ values: "falsy" }) // if phone is null, "", or undefine, then pass
    .isNumeric()
    .withMessage("電話號碼只能是數字"),
];
const validateAddress = [
  check("address")
    .optional({ values: "falsy" })
    .matches(/^[a-zA-Z0-9\u4e00-\u9fa5\s\-()號樓層巷弄段路街區市縣]*$/)
    .withMessage("地址包含無效字元（請使用正體中文書寫）"),
];
const validateUsername = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("使用者名稱為必填欄位") // Username is required
    .isLength({ min: 5 })
    .withMessage("使用者名稱至少5個字") // Username must be at least 5 characters long
    .isAlphanumeric()
    .withMessage("使用者名稱只能包含英文字母和阿拉伯數字") // Username must contain only letters and numbers
    .trim()
    .escape(),
];
const validatePassword = [
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("使用者密碼為必填欄位") // Password is required
    .isLength({ min: 6 })
    .withMessage("使用者密碼至少6個字") // Password must be at least 6 characters long
    .matches(/\d/)
    .withMessage("使用者密碼必須包含至少一個阿拉伯數字") // Password must contain at least one number
    .matches(/[a-zA-Z]/)
    .withMessage("使用者密碼必須包含至少一個大小寫英文字母") // Password must contain at least one letter
    .trim()
    .escape(),
];
const validateConfirmPassword = [
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("請再填寫一次使用者密碼") // Confirm password is required
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("密碼核對失敗"); // Passwords do not match
      }
      return true;
    }),
];

export const validateRegister = [
  ...validateUsername,
  ...validatePassword,
  ...validateConfirmPassword,
  ...validateCompanyId,
];

export const validateLogin = [...validateUsername, ...validatePassword];
