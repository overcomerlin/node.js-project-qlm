import prisma from "./model.prismaClient.js";
import getTime from "../utils/utils.getTime.js";
import createError from "http-errors";

/**
 * Checks if a company exists in the database by its ID.
 * @param {number} companyId - The ID of the company to validate.
 * @returns {boolean} True if companyID exists, otherwise false.
 * @throws {import('http-errors').HttpError} Throws a 404 error if the company is not found.
 * @throws {import('http-errors').HttpError} Throws a 500 error for other server-side failures.
 */
export async function checkCompanyId(companyId) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw createError(404, "Company not found");
    }
    return true;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to check company data", {
      cause: err,
    });
  }
}

/**
 * Fetches a summary list of all companies.
 * This returns a lightweight list containing only the ID, code, and name for each company.
 * @returns {Promise<Array<{id: number, companyCode: string, companyName: string}>>} A promise that resolves to an array of company summary objects.
 * @throws {import('http-errors').HttpError} Throws a 404 error if no companies are found.
 * @throws {import('http-errors').HttpError} Throws a 500 error for other server-side failures.
 */
export async function getAllCompaniesSummary() {
  try {
    const data = await prisma.company.findMany({
      select: { id: true, companyCode: true, companyName: true },
    });
    if (!data || data.length === 0) {
      throw createError(404, "No company data found");
    }
    return data;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to fetch company data", {
      cause: err,
    });
  }
}

/**
 * Creates a new company record in the database.
 * @param {object} companyData - The data object for the new company.
 * @param {string} companyData.companyCode - The unique code for the company.
 * @param {string} companyData.companyName - The name of the company.
 * @param {string} [companyData.taxId] - (Optional) The tax ID of the company.
 * @param {string} [companyData.phone] - (Optional) The phone number of the company.
 * @param {string} [companyData.address] - (Optional) The address of the company.
 * @returns {Promise<import('@prisma/client').Company>} A promise that resolves to the newly created company object.
 * @throws {import('http-errors').HttpError} Throws a 409 error if the company code already exists.
 * @throws {import('http-errors').HttpError} Throws a 500 error for other server-side failures.
 */
export async function createCompany({
  companyCode,
  companyName,
  taxId,
  phone,
  address,
}) {
  const remark = {
    [getTime.remarkTimestamp]: `建立新公司資料 - ${companyName}`,
  };
  try {
    const newCompany = await prisma.company.create({
      data: { companyCode, companyName, taxId, phone, address, remark },
    });
    return newCompany;
  } catch (err) {
    if (err.code === "P2002" && err.meta?.target?.includes("companyCode")) {
      throw createError(
        409,
        `Company with code '${companyCode}' already exists.`
      );
    }
    throw createError(500, "Failed to create a new company", {
      cause: err,
    });
  }
}

export async function getAllCompany({ user }) {
  try {
    const userCheck = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { username: true },
    });
    if (!userCheck)
      throw createError(404, `User with ID '${user.userId}' not found`);
    const allCompany = await prisma.company.findMany({
      where: { deletedAt: null },
      select: { id: true, companyCode: true, companyName: true },
    });
    return allCompany;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get all companies", { cause: err });
  }
}

export async function getCompanyId({ user }) {
  try {
    const companyId = await prisma.company.findUnique({
      where: { companyCode: user.companyCode },
      select: { id: true },
    });
    return companyId.id;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to get company id", { cause: err });
  }
}

/**
 * Creates multiple company records in the database from an array of data (batch creation).
 * This function will skip creating companies where the companyCode already exists.
 * @param {object} params - The parameters for creating many companies.
 * @param {Array<object>} params.data - An array of company data objects to import. Each object should have keys like `COMPANY_CODE`, `COMPANY_NAME`, etc.
 * @param {object} params.user - The user performing the operation, used for logging.
 * @returns {Promise<{count: number}>} A promise that resolves to an object containing the count of newly created companies.
 * @throws {import('http-errors').HttpError} Throws a 500 error for server-side failures.
 */
export async function createCompanyMany({ data, user: operator }) {
  try {
    // Map the input data to the format expected by Prisma's createMany
    const companiesToCreate = data.map((row) => {
      // Basic validation to ensure essential fields are present
      if (!row.COMPANY_CODE || !row.COMPANY_NAME) {
        return null;
      }
      return {
        companyCode: row.COMPANY_CODE,
        companyName: row.COMPANY_NAME,
        taxId: String(row.TAX_ID),
        phone: String(row.PHONE),
        address: row.ADDRESS,
        remark: {
          [getTime.remarkTimestamp]: `批次建立新公司資料 - ${row.COMPANY_NAME} by ${operator.username}`,
        },
      };
    });

    // Use createMany for an efficient bulk insert operation, skipping duplicates.
    const result = await prisma.company.createMany({
      data: companiesToCreate.filter(Boolean), // Filter out any null (invalid) entries
      skipDuplicates: true, // This will prevent errors if a companyCode already exists
    });

    return { count: result.count };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError(500, "Failed to create many companies with import data", {
      cause: err,
    });
  }
}
