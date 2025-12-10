import prisma from "./model.prismaClient.js";
import { randomUUID } from "crypto";
import createError from "http-errors";
import { getCompanyId } from "./model.company.js";
import { parse } from "date-fns";
import { getUserId } from "./model.user.js";
import getTime from "../utils/utils.getTime.js";

export async function busSN_ID_Check({ data, user }) {
  try {
    const userInfo = await prisma.user.findUnique({
      where: { username: user?.username },
      select: { companyId: true },
    });
    if (!userInfo) {
      throw createError(404, "User not found");
    }
    let searchPrefix = `${data.BUS_SN}_${data.BUS_ID}`;
    const bothExist = await prisma.crtfData.findFirst({
      where: {
        companyId: userInfo.companyId,
        crtfNo: { startsWith: searchPrefix },
        deletedAt: null,
      },
    });
    if (!!bothExist) {
      return { BUS_SN: true, BUS_ID: true, both: true };
    } else {
      searchPrefix = `${data.BUS_SN}_`;
      const busSNExist = await prisma.crtfData.findFirst({
        where: {
          companyId: userInfo.companyId,
          crtfNo: { contains: searchPrefix },
          deletedAt: null,
        },
      });
      searchPrefix = `${data.BUS_ID}_`;
      const busIDExist = await prisma.crtfData.findFirst({
        where: {
          companyId: userInfo.companyId,
          crtfNo: { contains: searchPrefix },
          deletedAt: null,
        },
      });
      return { BUS_SN: !!busSNExist, BUS_ID: !!busIDExist, both: false };
    }
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (Check SN/ID)", {
      cause: err,
    });
  }
}

export async function deleteSN_ID({ searchPrefix, user }) {
  try {
    const userInfo = await prisma.user.findUnique({
      where: { username: user?.username },
      select: { companyId: true },
    });
    let result = [];
    if (!userInfo) {
      throw createError(404, "User not found");
    } else {
      for (const prefix of searchPrefix) {
        if (!prefix) {
          result.push(null);
          continue;
        } else {
          result.push(
            await prisma.crtfData.updateMany({
              where: {
                companyId: userInfo.companyId,
                crtfNo: { contains: prefix },
                deletedAt: null,
              },
              data: { deletedAt: new Date(), deletedById: user.id },
            })
          );
        }
      }
    }
    return result;
  } catch (err) {
    if (err.code === "P2025") {
      throw createError(404, `crtfNo contains ${searchPrefix} not found.`);
    } else if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (Delete SN/ID)", {
      cause: err,
    });
  }
}

export async function saveCrtf({ data, user }) {
  try {
    const userInfo = await prisma.user.findUnique({
      where: { username: user?.username },
      select: { companyId: true },
    });
    if (!userInfo) {
      throw createError(404, "User not found");
    }
    const { PUBLISH_MODE, REMARK, ...crttfField } = data;
    let CATEGORY = "";
    if (PUBLISH_MODE === "新發") CATEGORY = "ISSUE";
    else if (PUBLISH_MODE === "換發") CATEGORY = "RENEW";
    else if (PUBLISH_MODE === "補發") CATEGORY = "REPLACE";

    const result = await prisma.crtfData.create({
      data: {
        crtfNo: data.BUS_SN + "_" + data.BUS_ID + "_" + randomUUID(),
        crtfField: crttfField,
        category: CATEGORY,
        company: { connect: { id: userInfo.companyId } },
        createdBy: { connect: { id: user.id } },
        remark: REMARK,
      },
    });
    return result;
  } catch (err) {
    if (err.code === "P2002" && err.meta?.target?.includes("crtfNo")) {
      throw createError(
        409,
        `crtfNo '${err.meta.target}' existed, please check again.`
      );
    }
    if (err.statusCode) throw err;
    throw createError(500, "Internal Server Error (Save CRTF)", { cause: err });
  }
}

export async function saveCrtfMany({ data, user: operator }) {
  try {
    // Perpare an array of a promise, where each promise is a prism.crtfData.create operation
    const crtfToCreateData = await Promise.all(
      data.map(async (row) => {
        const userId = await getUserId({
          user: { username: row.USERNAME },
        });
        const companyId = await getCompanyId({
          user: { companyCode: row.COMPANY_CODE },
        });
        const user = { username: row.USERNAME, id: userId };
        const checkResult = await busSN_ID_Check({ data: row, user });
        let searchPrefix = [];
        if (checkResult.BUS_SN && checkResult.BUS_ID && checkResult.both) {
          searchPrefix = [`${row.BUS_SN}_${row.BUS_ID}`, null];
        } else if (
          checkResult.BUS_SN &&
          checkResult.BUS_ID &&
          !checkResult.both
        ) {
          searchPrefix = [`${row.BUS_SN}_`, `${row.BUS_ID}_`];
        } else if (
          !checkResult.BUS_SN &&
          checkResult.BUS_ID &&
          !checkResult.both
        ) {
          searchPrefix = [`${row.BUS_ID}_`, null];
        } else if (
          checkResult.BUS_SN &&
          !checkResult.BUS_ID &&
          !checkResult.both
        ) {
          searchPrefix = [`${row.BUS_SN}_`, null];
        }
        const deleteResult = await deleteSN_ID({ searchPrefix, user });

        const { PUBLISH_MODE, REMARK, ...crttfTmp } = row;
        let CATEGORY = "";
        if (PUBLISH_MODE === "新發") CATEGORY = "ISSUE";
        else if (PUBLISH_MODE === "換發") CATEGORY = "RENEW";
        else if (PUBLISH_MODE === "補發") CATEGORY = "REPLACE";
        const crtfData = {
          ...crttfTmp,
          BUILD_DATE: parse(
            crttfTmp.BUILD_DATE,
            "yyyy:MM:dd_HH:mm:ss",
            new Date()
          ),
          PUBLISH_DATE: parse(
            crttfTmp.PUBLISH_DATE,
            "yyyy:MM:dd_HH:mm:ss",
            new Date()
          ),
          NEXT_DATE: parse(
            crttfTmp.NEXT_DATE,
            "yyyy:MM:dd_HH:mm:ss",
            new Date()
          ),
        };
        return {
          crtfNo: row.BUS_SN + "_" + row.BUS_ID + "_" + randomUUID(),
          crtfField: crtfData,
          category: CATEGORY,
          company: { connect: { id: companyId } },
          createdBy: { connect: { id: userId } },
          createdAt: crtfData.BUILD_DATE,
          updatedAt: crtfData.BUILD_DATE,
          remark: {
            [getTime.remarkTimestamp]: `批次建立合格證資料 - ${REMARK} by ${operator.username}`,
          },
        };
      })
    );

    // Filter out invalid data and map to Prisma create operations
    const createOperations = crtfToCreateData.map((crtfData) =>
      prisma.crtfData.create({ data: crtfData })
    );
    // Execute all valid create operations in a single transaction
    const createdCrtfs = await prisma.$transaction(createOperations);

    return { count: createdCrtfs.count };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to create many CRTF with import data", {
      cause: err,
    });
  }
}

export async function getAllStoredData({ user }) {
  try {
    const userInfo = await prisma.user.findUnique({
      where: { id: user?.userId },
      select: { companyId: true },
    });
    if (!userInfo) {
      throw createError(404, "User not found");
    }

    const result = await prisma.crtfData.findMany({
      where: { companyId: userInfo.companyId, deletedAt: null },
      select: {
        crtfNo: true,
        crtfField: true,
        category: true,
        remark: true,
        createdAt: true,
      },
    });
    return result;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get all stored data", { cause: err });
  }
}

export async function getCrtfDataByAdmin() {
  try {
    const result = await prisma.crtfData.findMany({
      select: {
        crtfField: true,
        category: true,
        company: { select: { companyCode: true, companyName: true } },
        createdBy: { select: { username: true } },
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        remark: true,
      },
    });
    return result;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get crtf data by admin", { cause: err });
  }
}

export async function getCrtfDataByUser({ user }) {
  try {
    const companyId = await getCompanyId({ user });
    const result = await prisma.crtfData.findMany({
      where: { companyId: companyId },
      select: {
        crtfField: true,
        category: true,
        company: { select: { companyName: true } },
        createdBy: { select: { username: true } },
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        remark: true,
      },
    });
    return result;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get crtf data by user", { cause: err });
  }
}
