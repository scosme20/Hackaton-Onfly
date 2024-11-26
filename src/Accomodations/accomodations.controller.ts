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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

const VALID_CATEGORIES: accommodations_type[] = [
  accommodations_type.HOTEL,
  accommodations_type.APARTMENT,
  accommodations_type.RESORT,
  accommodations_type.INN,
  accommodations_type.MOTEL,
  accommodations_type.GUESTHOUSE,
  accommodations_type.VILLA,
  accommodations_type.COTTAGE,
  accommodations_type.CABIN,
]

@ApiTags('Accommodations')
@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @ApiOperation({ summary: 'Obter todas as acomodações' })
  @ApiResponse({
    status: 200,
    description: 'Acomodações encontradas com sucesso',
  })
  @ApiResponse({ status: 500, description: 'Erro ao listar acomodações' })
  @Get()
  async findAll() {
    try {
      return await this.accommodationsService.findAll()
    } catch (error) {
      console.error('Erro ao listar acomodações:', error.message)
      throw new InternalServerErrorException('Erro ao listar acomodações')
    }
  }

  @ApiOperation({ summary: 'Buscar acomodações por categoria' })
  @ApiResponse({ status: 200, description: 'Acomodações encontradas' })
  @ApiResponse({ status: 400, description: 'Categoria inválida' })
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

  @ApiOperation({ summary: 'Buscar acomodações por ID' })
  @ApiResponse({ status: 200, description: 'Acomodação encontrada' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar acomodação por ID' })
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
