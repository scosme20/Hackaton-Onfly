import { Module } from '@nestjs/common'
import { HttpModule as AxiosHttpModule } from '@nestjs/axios'

@Module({
  imports: [AxiosHttpModule],
  exports: [AxiosHttpModule],
})
export class HttpModule {}
