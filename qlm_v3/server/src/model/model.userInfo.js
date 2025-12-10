// import prismaClient from "./model.prismaClient.js";
import prisma from "./model.prismaClient.js";
import createError from "http-errors";

export async function getFields({ username }) {
  try {
    const result = await prisma.user.findUnique({
      where: { username },
      select: { userInfo: { select: { functionality: true } } },
    });
    if (!result || !result.userInfo)
      throw createError(
        404,
        `Fields information not found for user ${username}`
      );
    // Add REMARK and HISTORIC_REMARK field additionally
    return {
      ...result.userInfo.functionality.FIELDS,
      REMARK: true,
      HISTORIC_REMARK: true,
    };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (Get Fields)", {
      cause: err,
    });
  }
}

export async function getPublishModeFields({ username }) {
  try {
    const result = await prisma.user.findUnique({
      where: { username },
      select: { userInfo: { select: { functionality: true } } },
    });
    if (!result || !result.userInfo)
      throw createError(
        404,
        `Fields information not found for user ${username}`
      );
    // return {ISSUE, RENEW, REPLACE}
    return {
      ISSUE: result.userInfo.functionality.ISSUE,
      RENEW: result.userInfo.functionality.RENEW,
      REPLACE: result.userInfo.functionality.REPLACE,
    };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (get publish mode fields)", {
      cause: err,
    });
  }
}

export async function getModuleFields({ username }) {
  try {
    const result = await prisma.user.findUnique({
      where: { username },
      select: { userRole: true, userInfo: { select: { functionality: true } } },
    });
    if (!result || !result.userInfo)
      throw createError(
        404,
        `Fields information not found for user ${username}`
      );
    // return all module fields except fields
    const { FIELDS: _, ...moudleFields } = result.userInfo.functionality;
    return { userRole: result.userRole, ...moudleFields };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(
      500,
      "Internal Server Error (get status for each modules)",
      { cause: err }
    );
  }
}

export async function getPrintTune({ username }) {
  try {
    const result = await prisma.user.findUnique({
      where: { username },
      select: { userInfo: { select: { printTune: true } } },
    });
    if (!result?.userInfo?.printTune)
      throw createError(404, `Print Tune information not found`);
    return result.userInfo.printTune;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (get print tune)", {
      cause: err,
    });
  }
}

export async function savePrintTune({ userId, sendPrintTuneData }) {
  try {
    await prisma.userInfo.update({
      where: { userId },
      data: { printTune: sendPrintTuneData },
    });
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (save print tune)", {
      cause: err,
    });
  }
}

export async function saveFuncSwitch({ userId, functionFields }) {
  try {
    const checkUserId = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });
    if (!checkUserId) throw createError(404, "User not found");
    await prisma.user.update({
      where: { username: functionFields.username },
      data: {
        userInfo: { update: { functionality: functionFields.functionality } },
      },
    });
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (save function switch)", {
      cause: err,
    });
  }
}
