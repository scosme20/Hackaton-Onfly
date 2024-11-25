import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AccommodationsService } from './accomodations.service'
import axios from 'axios'

@Controller('accommodations')
export class AccommodationsController {
  private readonly openCageApiKey = '649ce940f26944148f28236a9fa44f32'

  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Get()
  async findAll() {
    try {
      return await this.accommodationsService.findAll()
    } catch (error) {
      console.error('Erro ao buscar acomodações:', error.message)
      throw new HttpException(
        'Erro interno ao buscar acomodações',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get('search')
  async searchByCategory(@Query('category') category: string) {
    if (!category) {
      throw new HttpException('Categoria não fornecida', HttpStatus.BAD_REQUEST)
    }

    try {
      return await this.accommodationsService.searchByCategory(category)
    } catch (error) {
      console.error('Erro ao buscar acomodações por categoria:', error.message)
      throw new HttpException(
        'Erro ao buscar acomodações por categoria',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get('search-by-zip')
  async searchByZipCode(@Query('zipCode') zipCode: string) {
    if (!zipCode) {
      throw new HttpException('CEP não fornecido', HttpStatus.BAD_REQUEST)
    }

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${this.openCageApiKey}`,
      )

      const result = response.data.results[0]

      if (!result) {
        throw new HttpException(
          'Não foi possível encontrar dados de localização para este CEP',
          HttpStatus.NOT_FOUND,
        )
      }

      const { lat, lng } = result.geometry
      return await this.accommodationsService.findNearbyAccommodations(lat, lng)
    } catch (error) {
      console.error('Erro ao buscar acomodações por CEP:', error.message)
      throw new HttpException(
        'Erro interno ao buscar acomodações por CEP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
