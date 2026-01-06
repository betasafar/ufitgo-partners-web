import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Operator } from '../operators/entities/operator.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operator])],
  controllers: [ProfileController],
  providers: [ProfileService, CloudinaryService],
})
export class ProfileModule {}
