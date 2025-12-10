import config from "../config/index.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

// env params
const cost = Number.parseInt(config.bcrypt.cost, 10);
const pepper = config.bcrypt.papper || "";

// upper bound for string length
const MAX_CHAR_LEN = Number.parseInt(config.bcrypt.maxLength, 10);

// bcrypt upper bound: 72 bytes
const MAX_BCRYPT_BYTES = 72;

// Build class PasswordPolicyError
export class PasswordPolicyError extends Error {
  constructor(message) {
    super(message);
    this.name = "PasswordPolicyError";
  }
}

// if pepper existed, combine password + pepper, otherwise return password only
function combinedInput(password) {
  return pepper ? password + pepper : password;
}

/**
 * Policy for password validation：
 * 1) string length
 * 2) UTF-8 bytes length（72 bytes）
 */
function assertPasswordLengthPolicy(password) {
  if (typeof password !== "string") {
    throw new PasswordPolicyError("Password must be a string.");
  }
  if (password.length > MAX_CHAR_LEN) {
    throw new PasswordPolicyError(
      `Password exceeds maximum length (${MAX_CHAR_LEN} characters).`
    );
  }
  const bytes = Buffer.byteLength(combinedInput(password), "utf8");
  if (bytes > MAX_BCRYPT_BYTES) {
    throw new PasswordPolicyError(
      `Password is too long for bcrypt after pepper: ${bytes} bytes (limit ${MAX_BCRYPT_BYTES}).`
    );
  }
}

/**
 * Produce hash password
 */
export async function hashPassword(password) {
  assertPasswordLengthPolicy(password);
  const input = combinedInput(password);
  return bcrypt.hash(input, cost);
}

/**
 * Hash code verification
 * - 依舊比對「password + pepper」對應的輸入
 * - 若 bytes 超限，不阻擋登入（避免鎖帳），但記錄警告，建議讓使用者重設密碼
 */
export async function comparePassword(password, hash) {
  const input = combinedInput(password);
  const bytes = Buffer.byteLength(input, "utf8");
  if (bytes > MAX_BCRYPT_BYTES) {
    console.warn(
      `comparePassword(): input bytes (${bytes}) > ${MAX_BCRYPT_BYTES}. The stored hash may have been created with truncated input. Consider forcing a password reset.`
    );
  }
  return bcrypt.compare(input, hash);
}

/**
 * 判斷是否需要 rehash（用於後平滑升級）
 * - 版本應為 $2b$
 * - 成本（cost）若低於目前設定，建議升級
 */
export function needsRehash(bcryptHash, currentCost = cost) {
  const m = /^\$(?<ver>2[abxy])\$(?<cc>\d{2})\$/u.exec(bcryptHash);
  if (!m?.groups) return true; // 格式不對 -> 直接建議重算
  const ver = m.groups.ver;
  const storedCost = Number.parseInt(m.groups.cc, 10);
  if (ver !== "2b") return true;
  return storedCost < currentCost;
}

/**
 * Cost calibration: test and get the optimal cost (time target: 150 ms) before deploy and put into .env
 */
export async function calibrateCost(
  targetMs = 150,
  minCost = 10,
  maxCost = 15
) {
  const sample = "calibration-sample-password-" + crypto.randomUUID();
  let c = minCost;
  while (c < maxCost) {
    const t0 = Date.now();
    await bcrypt.hash(sample, c);
    const ms = Date.now() - t0;
    if (ms >= targetMs) break;
    c++;
  }
  return c;
}
