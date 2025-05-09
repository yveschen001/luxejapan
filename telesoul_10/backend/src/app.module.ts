import { Module } from '@nestjs/common';
import { UserModule } from './services/user/user.module';
import { MatchModule } from './services/match/match.module';
import { PaymentModule } from './services/payment/payment.module';
import { KycModule } from './services/kyc/kyc.module';

@Module({
  imports: [
    UserModule,
    MatchModule,
    PaymentModule,
    KycModule,
  ],
})
export class AppModule {} 