import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class CreateAccommodationDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  address: string

  @IsNotEmpty()
  @IsString()
  city: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  price?: number
}
