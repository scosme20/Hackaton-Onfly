import {
  Controller,
  Get,
  Query,
  Param,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { AccommodationsService } from './accomodations.service'
import { accommodations_type } from '@prisma/client'

const VALID_CATEGORIES: accommodations_type[] = [
  'HOTEL',
  'HOSTEL',
  'APARTMENT',
  'RESORT',
  'INN',
  'MOTEL',
  'GUESTHOUSE',
  'VILLA',
  'COTTAGE',
  'CABIN',
]

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  async findAll() {
    try {
      return await this.accommodationsService.findAll()
    } catch (error) {
      console.error('Erro ao listar acomodações:', error.message)
      throw new InternalServerErrorException('Erro ao listar acomodações')
    }
  }

  @Get('search')
  async searchByCategory(@Query('category') category: string) {
    if (!VALID_CATEGORIES.includes(category as accommodations_type)) {
      throw new BadRequestException('Categoria inválida')
    }

    try {
      return await this.accommodationsService.searchByCategory(
        category as accommodations_type,
      )
    } catch (error) {
      console.error('Erro ao buscar por categoria:', error.message)
      throw new InternalServerErrorException('Erro ao buscar por categoria')
    }
  }

  @Get('search-by-zip')
  async searchByZipCode(@Query('zipCode') zipCode: string) {
    if (!zipCode || zipCode.trim().length === 0) {
      throw new BadRequestException('CEP inválido')
    }

    try {
      const location =
        await this.accommodationsService.getCoordinatesByZipCode(zipCode)

      return await this.accommodationsService.findNearbyAccommodations(
        location.lat,
        location.lng,
      )
    } catch (error) {
      console.error('Erro ao buscar por CEP:', error.message)
      throw new InternalServerErrorException(
        'Erro ao buscar acomodações pelo CEP',
      )
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const parsedId = parseInt(id, 10)

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID inválido')
    }

    try {
      return await this.accommodationsService.findById(parsedId)
    } catch (error) {
      console.error('Erro ao buscar acomodação por ID:', error.message)
      throw new InternalServerErrorException('Erro ao buscar acomodação por ID')
    }
  }
}
