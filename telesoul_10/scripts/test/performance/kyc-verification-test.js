import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// 自定义指标
const errorRate = new Rate('errors');
const kycSubmissionTime = new Trend('kyc_submission_time');
const kycVerificationTime = new Trend('kyc_verification_time');
const documentValidationTime = new Trend('document_validation_time');

// 测试配置
export const options = {
  stages: [
    { duration: '1m', target: 20 },  // 预热
    { duration: '3m', target: 50 },  // 正常负载
    { duration: '1m', target: 100 }, // 压力测试
    { duration: '1m', target: 0 },   // 冷却
  ],
  thresholds: {
    errors: ['rate<0.05'],           // 错误率低于 5%
    http_req_duration: ['p(95)<1000'], // 95% 的请求在 1s 内完成
    kyc_submission_time: ['p(95)<2000'],
    kyc_verification_time: ['p(95)<3000'],
    document_validation_time: ['p(95)<1500'],
  },
};

// 测试数据
const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  userId: 'test-user-1',
  documentType: 'ID_CARD',
  documentNumber: '123456789',
  documentImage: 'base64_image_data',
};

// 辅助函数
function generateRandomKyc() {
  return {
    ...TEST_USER,
    userId: `test-user-${Date.now()}`,
    documentNumber: `${Math.floor(Math.random() * 1000000000)}`,
  };
}

// 测试场景
export default function () {
  // 提交 KYC
  const submissionStartTime = new Date();
  const submissionResponse = http.post(
    `${BASE_URL}/api/kyc/submit`,
    JSON.stringify(generateRandomKyc()),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  kycSubmissionTime.add(new Date() - submissionStartTime);

  check(submissionResponse, {
    'KYC 提交成功': (r) => r.status === 201,
  });

  if (submissionResponse.status === 201) {
    const kycId = JSON.parse(submissionResponse.body).id;

    // 验证文档
    const validationStartTime = new Date();
    const validationResponse = http.post(
      `${BASE_URL}/api/kyc/validate/${kycId}`,
      null,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    documentValidationTime.add(new Date() - validationStartTime);

    check(validationResponse, {
      '文档验证成功': (r) => r.status === 200,
    });

    // 验证 KYC
    const verificationStartTime = new Date();
    const verificationResponse = http.post(
      `${BASE_URL}/api/kyc/verify/${kycId}`,
      null,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    kycVerificationTime.add(new Date() - verificationStartTime);

    check(verificationResponse, {
      'KYC 验证成功': (r) => r.status === 200,
    });

    // 获取 KYC 状态
    const statusResponse = http.get(`${BASE_URL}/api/kyc/status/${kycId}`);
    check(statusResponse, {
      '获取 KYC 状态成功': (r) => r.status === 200,
    });
  }

  // 记录错误
  errorRate.add(submissionResponse.status !== 201);

  // 请求间隔
  sleep(1);
} 