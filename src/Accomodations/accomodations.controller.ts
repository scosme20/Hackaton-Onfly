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

  @ApiOperation({ summary: 'Buscar acomodações por CEP' })
  @ApiResponse({
    status: 200,
    description: 'Acomodações encontradas por CEP',
    type: Array,
  })
  @ApiResponse({ status: 400, description: 'CEP inválido' })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar acomodações por CEP',
  })
  @Get('search-by-cep')
  async searchByCep(@Query('cep') cep: string) {
    const cepPattern = /^\d{5}-?\d{3}$/

    if (!cepPattern.test(cep)) {
      throw new BadRequestException(
        'CEP inválido. Insira um CEP no formato "12345-678" ou "12345678".',
      )
    }

    try {
      const accommodations = await this.accommodationsService.searchByCep(cep)

      if (!accommodations || accommodations.length === 0) {
        throw new BadRequestException(
          'Nenhuma acomodação encontrada para o CEP fornecido.',
        )
      }

      return accommodations
    } catch (error) {
      console.error('Erro ao buscar acomodações por CEP:', error.message)
      throw new InternalServerErrorException(
        'Não foi possível buscar acomodações pelo CEP fornecido.',
      )
    }
  }

  @ApiOperation({ summary: 'Buscar acomodações por ID' })
  @ApiResponse({
    status: 200,
    description: 'Acomodação encontrada',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar acomodação por ID' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const parsedId = parseInt(id, 10)

    if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException(
        'ID inválido. O ID deve ser um número positivo.',
      )
    }

    try {
      const accommodation = await this.accommodationsService.findById(parsedId)

      if (!accommodation) {
        throw new BadRequestException('Acomodação não encontrada.')
      }

      return accommodation
    } catch (error) {
      console.error('Erro ao buscar acomodação por ID:', error.message)
      throw new InternalServerErrorException(
        'Não foi possível buscar a acomodação pelo ID fornecido.',
      )
    }
  }
}
