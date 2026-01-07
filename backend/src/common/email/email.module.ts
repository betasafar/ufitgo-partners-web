import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Global() // Makes EmailService available everywhere without importing module
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
