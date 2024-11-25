import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common'
import { AccommodationsService } from '../Accomodations/accomodations.service'
import { Prisma } from '@prisma/client'
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
      throw error
    }
  }

  @Post()
  async create(@Body() accommodationData: Prisma.accommodationsCreateInput) {
    try {
      return await this.accommodationsService.create(accommodationData)
    } catch (error) {
      console.error('Erro ao criar acomodação:', error.message)
      throw error
    }
  }

  @Get('search')
  async searchByCategory(@Query('category') category: string) {
    try {
      return await this.accommodationsService.searchByCategory(category)
    } catch (error) {
      console.error('Erro ao buscar acomodações por categoria:', error.message)
      throw error
    }
  }

  @Get('search-by-zip')
  async searchByZipCode(@Query('zipCode') zipCode: string) {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${this.openCageApiKey}`,
      )

      const result = response.data.results[0]

      if (!result) {
        throw new Error(
          'Não foi possível encontrar dados de localização para este CEP',
        )
      }

      const { lat, lng } = result.geometry

      return await this.accommodationsService.findNearbyAccommodations(lat, lng)
    } catch (error) {
      console.error('Erro ao buscar acomodações por CEP:', error.message)
      throw error
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() accommodationData: Prisma.accommodationsUpdateInput,
  ) {
    try {
      return await this.accommodationsService.update(id, accommodationData)
    } catch (error) {
      console.error('Erro ao atualizar acomodação:', error.message)
      throw error
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.accommodationsService.remove(id)
    } catch (error) {
      console.error('Erro ao excluir acomodação:', error.message)
      throw error
    }
  }
}
