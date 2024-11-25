import {
  Controller,
  Get,
  Param,
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
      this.handleError(error, 'Erro ao buscar acomodações')
    }
  }

  @Get('id/:id')
  async findById(@Param('id') id: string) {
    try {
      const parsedId = this.parseId(id)
      const accommodation = await this.accommodationsService.findById(parsedId)
      this.checkAccommodationExistence(accommodation)

      return accommodation
    } catch (error) {
      this.handleError(error, 'Erro ao buscar acomodação')
    }
  }

  @Get('type/:type')
  async searchByType(@Param('type') type: string) {
    if (!type) {
      throw new HttpException('Tipo não fornecido', HttpStatus.BAD_REQUEST)
    }

    try {
      return await this.accommodationsService.searchByType(type)
    } catch (error) {
      this.handleError(error, 'Erro ao buscar acomodações por tipo')
    }
  }

  @Get('nearby')
  async findNearbyAccommodations(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number = 10,
  ) {
    this.validateCoordinates(lat, lng)

    try {
      return await this.accommodationsService.findNearbyAccommodations(
        lat,
        lng,
        radius,
      )
    } catch (error) {
      this.handleError(error, 'Erro ao buscar acomodações próximas')
    }
  }

  @Get('search-by-zip')
  async searchByZipCode(@Query('zipCode') zipCode: string) {
    if (!zipCode) {
      throw new HttpException('CEP não fornecido', HttpStatus.BAD_REQUEST)
    }

    try {
      const coordinates = await this.getCoordinatesByZipCode(zipCode)
      return await this.accommodationsService.findNearbyAccommodations(
        coordinates.lat,
        coordinates.lng,
      )
    } catch (error) {
      this.handleError(error, 'Erro ao buscar acomodações por CEP')
    }
  }

  private async getCoordinatesByZipCode(
    zipCode: string,
  ): Promise<{ lat: number; lng: number }> {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${this.openCageApiKey}`

    try {
      const response = await axios.get(url)
      const result = response.data.results[0]

      if (!result) {
        throw new HttpException(
          'Não foi possível encontrar dados de localização para este CEP',
          HttpStatus.NOT_FOUND,
        )
      }

      const { lat, lng } = result.geometry
      return { lat, lng }
    } catch (error) {
      this.handleError(error, 'Erro ao consultar a API do OpenCage')
    }
  }

  private handleError(error: any, customMessage: string): void {
    console.error(error.message)
    throw new HttpException(customMessage, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  private parseId(id: string): number {
    const parsedId = Number(id)
    if (isNaN(parsedId)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST)
    }
    return parsedId
  }

  private checkAccommodationExistence(accommodation: any): void {
    if (!accommodation) {
      throw new HttpException('Acomodação não encontrada', HttpStatus.NOT_FOUND)
    }
  }

  private validateCoordinates(lat: number, lng: number): void {
    if (isNaN(lat) || isNaN(lng)) {
      throw new HttpException('Coordenadas inválidas', HttpStatus.BAD_REQUEST)
    }
  }
}
