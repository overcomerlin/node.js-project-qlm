import { hashPassword } from "../src/utils/utils.password.js";
import getTime from "../src/utils/utils.getTime.js";
import getFunctionlity from "../src/utils/utils.getFunctionlity.js";
import getPrintTune from "../src/utils/utils.getPrintTune.js";
import { PrismaClient, UserRole } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function createCompany() {
  const companyCode = "jsl";
  const companyName = "捷世林科技股份有限公司";
  const taxId = "13091876";
  const phone = "02-29030688";
  const address = "新北市泰山區新北大道六段411號10樓";
  //   const remark = JSON.parse(
  //     `{${String(getTime.remarkTimestamp)}: 建立新公司資料 - 捷世林科技股份有限公司}`
  //   );
  const remark = {
    [getTime.remarkTimestamp]: "建立新公司資料 - 捷世林科技股份有限公司",
  };
  const company = await prisma.company.create({
    data: {
      companyCode: companyCode,
      companyName: companyName,
      taxId: taxId,
      phone: phone,
      address: address,
      remark: remark,
    },
  });
  console.log(
    `\n*** Init create a company ***\n Name: ${company.companyName}\nCode: ${company.companyCode}`
  );
}

async function createUser() {
  await prisma.company
    .findMany({
      select: { id: true, remark: true },
      where: { companyCode: "jsl" },
    })
    .then(async (company) => {
      await prisma.user
        .create({
          data: {
            userRole: UserRole.ADMIN,
            username: "jasslin01",
            password: await hashPassword("13091876"),
            companyId: company[0].id,
            userInfo: {
              create: {
                functionality: getFunctionlity(
                  "111111111111111111",
                  "1111111111111111"
                ),
                printTune: getPrintTune([
                  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                ]),
                remark: { [getTime.remarkTimestamp]: "建立使用者" },
              },
            },
          },
        })
        .then((user) => console.log("A new user created:", user))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

async function main() {
  await createCompany()
    .catch((err) => console.log(err))
    .finally(async () => await prisma.$disconnect());
  await createUser()
    .catch((err) => console.log(err))
    .finally(async () => await prisma.$disconnect());
  console.log("done");
}

main();
