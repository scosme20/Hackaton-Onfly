import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import axios from 'axios'
import { PrismaService } from '../../prisma/prisma.service'
import { accommodations_type } from '@prisma/client'

@Injectable()
export class AccommodationsService {
  private readonly openCageApiKey = '649ce940f26944148f28236a9fa44f32'

  constructor(private readonly prisma: PrismaService) {}

  private sanitizeAndValidateCep(cep: string): string {
    const sanitizedCep = cep.trim().replace('-', '')
    const cepPattern = /^\d{8}$/

    if (!cepPattern.test(sanitizedCep)) {
      throw new BadRequestException(
        'CEP inválido. O formato esperado é apenas números com 8 dígitos.',
      )
    }

    return sanitizedCep
  }

  async getCoordinatesByZipCode(
    zipCode: string,
  ): Promise<{ lat: number; lng: number }> {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${this.openCageApiKey}`,
      )

      const result = response.data.results[0]
      if (result) {
        return result.geometry
      }

      console.log('Tentando buscar com ViaCEP...')
      const viaCepResponse = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`,
      )

      const viaCepData = viaCepResponse.data
      if (viaCepData.erro) {
        throw new InternalServerErrorException(
          'Não foi possível encontrar dados de localização para este CEP.',
        )
      }

      return { lat: 0, lng: 0 }
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar coordenadas para o CEP ${zipCode}: ${error.message}`,
      )
    }
  }

  async searchByCep(cep: string): Promise<any[]> {
    const sanitizedCep = this.sanitizeAndValidateCep(cep)
    const coordinates = await this.getCoordinatesByZipCode(sanitizedCep)

    if (!coordinates) {
      throw new InternalServerErrorException(
        'Não foi possível obter coordenadas para o CEP.',
      )
    }

    return this.findNearbyAccommodations(coordinates.lat, coordinates.lng)
  }

  async findNearbyAccommodations(
    lat: number,
    lng: number,
    radius = 10,
  ): Promise<any[]> {
    const accommodations = await this.prisma.accommodations.findMany({
      select: {
        id: true,
        city: true,
        state: true,
        description: true,
        reviews: true,
        thumb: true,
        amenities: true,
        latitude: true,
        longitude: true,
      },
    })

    return accommodations.filter((accommodation) => {
      const accommodationLat = Number(accommodation.latitude)
      const accommodationLng = Number(accommodation.longitude)

      if (isNaN(accommodationLat) || isNaN(accommodationLng)) {
        return false
      }

      const distance = this.calculateDistance(
        accommodationLat,
        accommodationLng,
        lat,
        lng,
      )
      return distance <= radius
    })
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371
    const dLat = this.degToRad(lat2 - lat1)
    const dLon = this.degToRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) *
        Math.cos(this.degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  async findAll(): Promise<any[]> {
    return this.prisma.accommodations.findMany()
  }

  async searchByCategory(category: accommodations_type): Promise<any[]> {
    return this.prisma.accommodations.findMany({
      where: { type: category },
    })
  }

  async findById(id: number): Promise<any> {
    return this.prisma.accommodations.findUnique({
      where: { id },
    })
  }
}
