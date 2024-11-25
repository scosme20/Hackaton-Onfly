import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AccommodationsModule } from './Accomodations/accomodations.module'

@Module({
  imports: [AccommodationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
