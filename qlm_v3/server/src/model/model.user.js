import prisma from "./model.prismaClient.js";
import { hashPassword, comparePassword } from "../utils/utils.password.js";
import getFunctionlity from "../utils/utils.getFunctionlity.js";
import getPrintTune from "../utils/utils.getPrintTune.js";
import getTime from "../utils/utils.getTime.js";
import createError from "http-errors";
import { getCompanyId } from "./model.company.js";

/**
 * Authenticates a user by checking their username and password.
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.username - The username to check.
 * @param {string} credentials.password - The plain-text password to compare.
 * @returns {Promise<Omit<import('@prisma/client').User, 'password'>>} A promise that resolves to the user object without the password.
 * @throws {import('http-errors').HttpError} Throws a 401 error for invalid credentials.
 * @throws {import('http-errors').HttpError} Throws a 500 error for other server-side failures.
 */
export async function userCheck({ username, password }) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw createError(401, "Invalid username or password");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw createError(401, "Invalid username or password");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(
      500,
      "User authentication failed due to an server error",
      { cause: err }
    );
  }
}

/**
 * Creates a new user with default user info and associates them with a company.
 * @param {object} userData - The data for the new user.
 * @param {string} userData.username - The desired username for the new user.
 * @param {string} userData.password - The plain-text password for the new user.
 * @param {number} userData.companyId - The ID of the company to associate the user with.
 * @returns {Promise<Omit<import('@prisma/client').User, 'password'>>} A promise that resolves to the newly created user object without the password.
 * @throws {import('http-errors').HttpError} Throws a 409 error if the username already exists.
 * @throws {import('http-errors').HttpError} Throws a 500 error for other server-side failures.
 */
export async function createUser({ username, password, companyId }) {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        companyId,
        userRole: "USER",
        userInfo: {
          create: {
            functionality: getFunctionlity(
              "111111111111111111",
              "1111011100001100"
            ),
            printTune: getPrintTune([
              1, 1, 12, 1, 1, 12, 1, 1, 12, 1, 1, 12, 1, 1, 12, 1, 1, 12, 1, 1,
              12,
            ]),
            remark: { [getTime.remarkTimestamp]: `建立使用者 - ${username}` },
          },
        },
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (err) {
    if (err.code === "P2002" && err.meta?.target?.includes("username")) {
      throw createError(
        409,
        `User with username '${username}' already exists.`
      );
    }
    throw createError(500, "Failed to create a new user", {
      cause: err,
    });
  }
}

/**
 * Creates multiple users from an array of imported data within a single transaction.
 * @param {object} params - The parameters for the operation.
 * @param {Array<object>} params.data - An array of user data objects from the import.
 * @param {object} params.user - The user performing the operation (the operator).
 * @returns {Promise<{count: number}>} A promise that resolves to an object with the count of created users.
 * @throws {import('http-errors').HttpError} Throws a 500 error for server-side failures.
 */
export async function createUserMany({ data, user: operator }) {
  try {
    //Prepare an array of promises, where each promise is a prisma.user.create operation
    const usersToCreateData = await Promise.all(
      data.map(async (row) => {
        const hashedPassword = await hashPassword(row.PASSWORD);
        const user = { companyCode: row.COMPANY_CODE };
        const companyId = await getCompanyId({ user });
        return {
          username: row.USERNAME,
          password: hashedPassword,
          companyId: companyId,
          userRole: "USER",
          userInfo: {
            create: {
              functionality: getFunctionlity(
                "111111111111111111",
                "1111011100001100"
              ),
              printTune: getPrintTune([
                1, 1, 12, 1, 1, 12, 1, 1, 12, 1, 1, 12, 1, 1, 12, 1, 1, 12, 1,
                1, 12,
              ]),
              remark: {
                [getTime.remarkTimestamp]: `批次建立使用者 - ${row.USERNAME} by ${operator.username}`,
              },
            },
          },
        };
      })
    );

    // Filter out invalid data and map to Prisma create operations.
    const createOperations = usersToCreateData.map((userData) =>
      prisma.user.create({ data: userData })
    );
    // Execute all valid create operations in a single transaction.
    const createUsers = await prisma.$transaction(createOperations);

    return { count: createUsers.length };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to create many users with import data", {
      cause: err,
    });
  }
}

/**
 * Retrieves the company code for a given username.
 * @param {object} params - The parameters for the query.
 * @param {string} params.username - The username to look up.
 * @returns {Promise<string>} A promise that resolves to the company code.
 * @throws {import('http-errors').HttpError} Throws a 404 error if the user is not found.
 * @throws {import('http-errors').HttpError} Throws a 500 error for other server-side failures.
 */
export async function getCompanyCodeByUsername({ username }) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: { company: { select: { companyCode: true } } },
    });
    if (!user?.company?.companyCode) {
      throw createError(
        404,
        `User '${username}' or associated company not found`
      );
    }
    return user.company.companyCode;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to retrieve company code", { cause: err });
  }
}

export async function getUserData({ user }) {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        userRole: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            companyName: true,
            companyCode: true,
            taxId: true,
            phone: true,
            address: true,
          },
        },
        userInfo: {
          select: {
            remark: true,
          },
        },
      },
    });
    if (!userData)
      throw createError(404, `User with ID '${user.userId}' not found`);
    return userData;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get user data (get user data)", {
      cause: err,
    });
  }
}

export async function saveUserData({ user, userInputData }) {
  try {
    const { UPDATEDAT, TAX_ID, PHONE, ADDRESS, REMARK, ...dumpedData } =
      userInputData;
    const updatedUserData = await prisma.user.update({
      where: { id: user.userId },
      data: {
        updatedAt: UPDATEDAT,
        company: {
          update: {
            taxId: TAX_ID,
            phone: PHONE,
            address: ADDRESS,
          },
        },
        userInfo: {
          update: {
            remark: REMARK,
          },
        },
      },
    });
    return updatedUserData;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to save user data", { cause: err });
  }
}

export async function saveUserPassword({ user, userInputPasswordData }) {
  try {
    const hashedPassword = await hashPassword(userInputPasswordData.PASSWORD);
    const updatedUserPasswordData = await prisma.user.update({
      where: { id: user.userId },
      data: {
        password: hashedPassword,
        updatedAt: userInputPasswordData.UPDATEDAT,
      },
    });
    return updatedUserPasswordData;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to save user password", { cause: err });
  }
}

export async function getAllUserFunctionality({ user }) {
  try {
    const userCheck = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { username: true },
    });
    if (!userCheck)
      throw createError(404, `User with ID '${user.userId}' not found`);
    const allUserFunctionality = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        username: true,
        userRole: true,
        userInfo: {
          select: {
            functionality: true,
          },
        },
      },
    });
    return allUserFunctionality;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get all users and their functionality", {
      cause: err,
    });
  }
}

export async function getAllUsername({ user }) {
  try {
    const userCheck = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { username: true },
    });
    if (!userCheck)
      throw createError(404, `User with ID '${user.userId}' not found`);
    const allUsername = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { username: true, companyId: true },
    });
    return allUsername;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get all usernames", { cause: err });
  }
}

export async function checkUserId({ user }) {
  try {
    const userCheck = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { username: true },
    });
    if (!userCheck) return false;
    return true;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to check user id", { cause: err });
  }
}

export async function getUserRole({ user }) {
  try {
    const userRole = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { userRole: true },
    });
    return userRole.userRole;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get user role", { cause: err });
  }
}

export async function getUserId({ user }) {
  try {
    const userId = await prisma.user.findUnique({
      where: { username: user.username },
      select: { id: true },
    });
    return userId.id;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get user id", { cause: err });
  }
}
