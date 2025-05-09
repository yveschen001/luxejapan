import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// 自定义指标
const errorRate = new Rate('errors');
const registrationTime = new Trend('registration_time');
const loginTime = new Trend('login_time');
const tokenRefreshTime = new Trend('token_refresh_time');

// 测试配置
export const options = {
  stages: [
    { duration: '1m', target: 30 },  // 预热
    { duration: '3m', target: 100 }, // 正常负载
    { duration: '1m', target: 200 }, // 压力测试
    { duration: '1m', target: 0 },   // 冷却
  ],
  thresholds: {
    errors: ['rate<0.02'],           // 错误率低于 2%
    http_req_duration: ['p(95)<800'], // 95% 的请求在 800ms 内完成
    registration_time: ['p(95)<1000'],
    login_time: ['p(95)<500'],
    token_refresh_time: ['p(95)<300'],
  },
};

// 测试数据
const BASE_URL = 'http://localhost:3000';

// 辅助函数
function generateRandomUser() {
  const timestamp = Date.now();
  return {
    username: `test_user_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: `Test123!@#${timestamp}`,
    phone: `+86${Math.floor(Math.random() * 10000000000)}`,
  };
}

// 测试场景
export default function () {
  // 注册新用户
  const registrationStartTime = new Date();
  const registrationResponse = http.post(
    `${BASE_URL}/api/users/register`,
    JSON.stringify(generateRandomUser()),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  registrationTime.add(new Date() - registrationStartTime);

  check(registrationResponse, {
    '注册成功': (r) => r.status === 201,
  });

  if (registrationResponse.status === 201) {
    const userData = JSON.parse(registrationResponse.body);

    // 登录
    const loginStartTime = new Date();
    const loginResponse = http.post(
      `${BASE_URL}/api/users/login`,
      JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    loginTime.add(new Date() - loginStartTime);

    check(loginResponse, {
      '登录成功': (r) => r.status === 200,
    });

    if (loginResponse.status === 200) {
      const { accessToken, refreshToken } = JSON.parse(loginResponse.body);

      // 刷新令牌
      const refreshStartTime = new Date();
      const refreshResponse = http.post(
        `${BASE_URL}/api/users/refresh-token`,
        JSON.stringify({ refreshToken }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      tokenRefreshTime.add(new Date() - refreshStartTime);

      check(refreshResponse, {
        '令牌刷新成功': (r) => r.status === 200,
      });

      // 使用新令牌访问受保护的资源
      const profileResponse = http.get(`${BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      check(profileResponse, {
        '获取用户资料成功': (r) => r.status === 200,
      });
    }
  }

  // 记录错误
  errorRate.add(registrationResponse.status !== 201);

  // 请求间隔
  sleep(1);
} 