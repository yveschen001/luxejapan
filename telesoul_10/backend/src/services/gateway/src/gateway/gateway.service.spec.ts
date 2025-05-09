import { Test, TestingModule } from "@nestjs/testing";
import { GatewayService } from "./gateway.service";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Session } from "@prisma/client";

describe("GatewayService", () => {
  let service: GatewayService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      apiKey: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      metrics: {
        create: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
    prismaService = module.get<PrismaService>(PrismaService);
    Object.setPrototypeOf(prismaService, PrismaService.prototype);
    (service as unknown as { prisma: PrismaService }).prisma = prismaService;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createSession", () => {
    it("should create a new session", async () => {
      const mockSession: Session = {
        id: "1",
        userId: "user-1",
        token: "token-1",
        createdAt: new Date(),
        expiresAt: new Date(),
        isActive: true,
      };

      (prismaService.session.create as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.createSession("user-1");
      expect(result).toEqual(mockSession);
      expect(prismaService.session.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-1",
          token: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
    });
  });

  describe("validateSession", () => {
    it("should return null for invalid token", async () => {
      (prismaService.session.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.validateSession("invalid-token");
      expect(result).toBeNull();
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { token: "invalid-token" },
      });
    });

    it("should return session for valid token", async () => {
      const mockSession: Session = {
        id: "1",
        userId: "user-1",
        token: "valid-token",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000), // tomorrow
        isActive: true,
      };

      (prismaService.session.findUnique as jest.Mock).mockResolvedValue(mockSession);
      const result = await service.validateSession("valid-token");
      expect(result).toEqual(mockSession);
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { token: "valid-token" },
      });
    });

    it("should return null for expired session", async () => {
      const mockSession: Session = {
        id: "1",
        userId: "user-1",
        token: "expired-token",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() - 86400000), // yesterday
        isActive: true,
      };

      (prismaService.session.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prismaService.session.update as jest.Mock).mockResolvedValue({ ...mockSession, isActive: false });

      const result = await service.validateSession("expired-token");
      expect(result).toBeNull();
      expect(prismaService.session.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { isActive: false },
      });
    });
  });

  describe("createApiKey", () => {
    it("should create a new api key", async () => {
      const mockApiKey = {
        id: "1",
        userId: "user-1",
        key: "tk_123",
        name: "test-key",
        isActive: true,
        createdAt: new Date(),
        expiresAt: null,
      };
      (prismaService.apiKey.create as jest.Mock).mockResolvedValue(mockApiKey);
      const result = await service.createApiKey("user-1", "test-key");
      expect(result).toEqual(mockApiKey);
      expect(prismaService.apiKey.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-1",
          key: expect.stringMatching(/^tk_/),
          name: "test-key",
        }),
      });
    });
  });

  describe("validateApiKey", () => {
    it("should return null for invalid key", async () => {
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.validateApiKey("invalid-key");
      expect(result).toBeNull();
      expect(prismaService.apiKey.findUnique).toHaveBeenCalledWith({ where: { key: "invalid-key" } });
    });

    it("should return null for inactive key", async () => {
      const mockApiKey = {
        id: "1",
        userId: "user-1",
        key: "tk_123",
        name: "test-key",
        isActive: false,
        createdAt: new Date(),
        expiresAt: null,
      };
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue(mockApiKey);
      const result = await service.validateApiKey("tk_123");
      expect(result).toBeNull();
    });

    it("should return null for expired key and update isActive", async () => {
      const yesterday = new Date(Date.now() - 86400000);
      const mockApiKey = {
        id: "1",
        userId: "user-1",
        key: "tk_123",
        name: "test-key",
        isActive: true,
        createdAt: new Date(),
        expiresAt: yesterday,
      };
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue(mockApiKey);
      (prismaService.apiKey.update as jest.Mock).mockResolvedValue({ ...mockApiKey, isActive: false });
      const result = await service.validateApiKey("tk_123");
      expect(result).toBeNull();
      expect(prismaService.apiKey.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { isActive: false },
      });
    });

    it("should return apiKey for valid key", async () => {
      const tomorrow = new Date(Date.now() + 86400000);
      const mockApiKey = {
        id: "1",
        userId: "user-1",
        key: "tk_123",
        name: "test-key",
        isActive: true,
        createdAt: new Date(),
        expiresAt: tomorrow,
      };
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue(mockApiKey);
      const result = await service.validateApiKey("tk_123");
      expect(result).toEqual(mockApiKey);
    });
  });

  describe("recordMetrics", () => {
    it("should record metrics and return result", async () => {
      const metricsData = {
        userId: "user-1",
        endpoint: "/api/test",
        method: "POST",
        statusCode: 200,
        duration: 123,
      };
      const mockMetrics = { id: "1", ...metricsData, createdAt: new Date() };
      (prismaService.metrics.create as jest.Mock).mockResolvedValue(mockMetrics);
      const result = await service.recordMetrics(metricsData);
      expect(result).toEqual(mockMetrics);
      expect(prismaService.metrics.create).toHaveBeenCalledWith({ data: metricsData });
    });
  });
});
