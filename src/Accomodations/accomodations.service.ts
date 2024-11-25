import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import axios from 'axios'

@Injectable()
export class AccommodationsService {
  private readonly openCageApiKey = '649ce940f26944148f28236a9fa44f32'

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    const accommodations = await this.prisma.accommodations.findMany({
      select: {
        id: true,
        city: true,
        state: true,
        description: true,
        reviews: true,
        thumb: true,
        amenities: true,
      },
    })

    return accommodations.map((accommodation) => ({
      id: accommodation.id,
      city: accommodation.city,
      state: accommodation.state,
      description: accommodation.description,
      rating: this.calculateAverageRating(accommodation.reviews),
      image: accommodation.thumb,
      benefits: this.parseJson(accommodation.amenities),
    }))
  }

  async findById(id: number): Promise<any | null> {
    const accommodation = await this.prisma.accommodations.findUnique({
      where: { id },
      select: {
        id: true,
        city: true,
        state: true,
        description: true,
        reviews: true,
        thumb: true,
        amenities: true,
      },
    })

    if (!accommodation) {
      return null
    }

    return {
      id: accommodation.id,
      city: accommodation.city,
      state: accommodation.state,
      description: accommodation.description,
      rating: this.calculateAverageRating(accommodation.reviews),
      image: accommodation.thumb,
      benefits: this.parseJson(accommodation.amenities),
    }
  }

  async searchByType(type: string): Promise<any[]> {
    const validTypes = [
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

    const upperCaseType = type.toUpperCase()

    if (!validTypes.includes(upperCaseType)) {
      throw new Error('Tipo inválido')
    }

    try {
      const accommodations = await this.prisma.accommodations.findMany({
        where: { type: upperCaseType as any },
        select: {
          id: true,
          city: true,
          state: true,
          description: true,
          reviews: true,
          thumb: true,
          amenities: true,
        },
      })

      return accommodations.map((accommodation) => ({
        id: accommodation.id,
        city: accommodation.city,
        state: accommodation.state,
        description: accommodation.description,
        rating: this.calculateAverageRating(accommodation.reviews),
        image: accommodation.thumb,
        benefits: this.parseJson(accommodation.amenities),
      }))
    } catch (error) {
      console.error('Erro ao buscar acomodações por tipo:', error.message)
      throw new Error('Erro interno ao buscar acomodações por tipo')
    }
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

  async getCoordinatesByZipCode(
    zipCode: string,
  ): Promise<{ lat: number; lng: number }> {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${this.openCageApiKey}`

    try {
      const response = await axios.get(url)
      const result = response.data.results[0]

      if (!result) {
        throw new Error('Localização não encontrada para este CEP')
      }

      const { lat, lng } = result.geometry
      return { lat, lng }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error.message)
      throw new Error('Erro ao consultar a API do OpenCage')
    }
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

  private calculateAverageRating(reviewsJson: unknown): number {
    const reviews = this.parseJson(reviewsJson)

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0
    }

    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    return total / reviews.length
  }

  private parseJson(json: unknown): any {
    try {
      return typeof json === 'string' ? JSON.parse(json) : json
    } catch {
      return null
    }
  }
}
