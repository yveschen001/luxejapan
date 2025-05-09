import { Module } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
