import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator'
import { accommodations_type } from '@prisma/client'

export class CreateAccommodationDto {
  @IsString()
  name: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  description: string

  @IsEnum(accommodations_type)
  type: accommodations_type

  @IsOptional()
  @IsNumber()
  stars?: number
}
