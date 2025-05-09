import { Module } from "@nestjs/common";
import { GatewayModule } from "./gateway/gateway.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    GatewayModule,
  ],
})
export class AppModule {}
