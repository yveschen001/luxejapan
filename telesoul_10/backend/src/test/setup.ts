import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // 清理测试数据库
  await prisma.$connect();
});

afterAll(async () => {
  // 断开数据库连接
  await prisma.$disconnect();
});

afterEach(async () => {
  // 每个测试后清理数据
  const tables = ['User', 'Match', 'Payment', 'KYC'];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
}); 