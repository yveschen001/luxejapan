import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// 自定义指标
const errorRate = new Rate('errors');
const matchCreationTime = new Trend('match_creation_time');
const userCreationTime = new Trend('user_creation_time');
const paymentProcessingTime = new Trend('payment_processing_time');

// 测试配置
export const options = {
  stages: [
    { duration: '1m', target: 50 },  // 预热
    { duration: '3m', target: 100 }, // 正常负载
    { duration: '1m', target: 200 }, // 压力测试
    { duration: '1m', target: 0 },   // 冷却
  ],
  thresholds: {
    errors: ['rate<0.1'],           // 错误率低于 10%
    http_req_duration: ['p(95)<500'], // 95% 的请求在 500ms 内完成
    match_creation_time: ['p(95)<1000'],
    user_creation_time: ['p(95)<800'],
    payment_processing_time: ['p(95)<1500'],
  },
};

// 测试数据
const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: 'test@example.com',
  name: 'Test User',
  gender: 'male',
  age: 25,
};

// 辅助函数
function generateRandomUser() {
  return {
    ...TEST_USER,
    email: `test${Date.now()}@example.com`,
  };
}

// 测试场景
export default function () {
  // 创建用户
  const userStartTime = new Date();
  const userResponse = http.post(`${BASE_URL}/api/users`, JSON.stringify(generateRandomUser()), {
    headers: { 'Content-Type': 'application/json' },
  });
  userCreationTime.add(new Date() - userStartTime);
  
  check(userResponse, {
    '用户创建成功': (r) => r.status === 201,
  });

  if (userResponse.status === 201) {
    const userId = JSON.parse(userResponse.body).id;

    // 创建匹配
    const matchStartTime = new Date();
    const matchResponse = http.post(
      `${BASE_URL}/api/matches`,
      JSON.stringify({
        userId,
        targetGender: 'female',
        targetAgeRange: [18, 30],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    matchCreationTime.add(new Date() - matchStartTime);

    check(matchResponse, {
      '匹配创建成功': (r) => r.status === 201,
    });

    if (matchResponse.status === 201) {
      const matchId = JSON.parse(matchResponse.body).id;

      // 创建支付
      const paymentStartTime = new Date();
      const paymentResponse = http.post(
        `${BASE_URL}/api/payments`,
        JSON.stringify({
          userId,
          amount: 10,
          currency: 'USDT',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      paymentProcessingTime.add(new Date() - paymentStartTime);

      check(paymentResponse, {
        '支付创建成功': (r) => r.status === 201,
      });
    }
  }

  // 检查健康状态
  const healthResponse = http.get(`${BASE_URL}/api/health`);
  check(healthResponse, {
    '健康检查通过': (r) => r.status === 200,
  });

  // 记录错误
  errorRate.add(healthResponse.status !== 200);

  // 请求间隔
  sleep(1);
} 