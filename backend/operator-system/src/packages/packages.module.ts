import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { Package } from './entities/package.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Package])],
  controllers: [PackagesController],
  providers: [PackagesService, CloudinaryService],
  exports: [PackagesService],
})
export class PackagesModule {}
