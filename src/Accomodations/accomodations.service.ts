import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { accommodations } from '@prisma/client'
import axios from 'axios'

@Injectable()
export class AccommodationsService {
  private readonly openCageApiKey = '649ce940f26944148f28236a9fa44f32'

  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<accommodations> {
    // Removendo o campo 'updatedAt' e passando apenas os dados válidos
    const { updatedAt, ...validData } = data

    return this.prisma.accommodations.create({
      data: validData, // Passando apenas os dados válidos, sem 'updatedAt'
    })
  }

  // Atualizar uma acomodação
  async update(id: number, data: any): Promise<accommodations> {
    try {
      const accommodation = await this.prisma.accommodations.update({
        where: { id },
        data: { ...data }, // Passando os dados a serem atualizados
      })
      return accommodation
    } catch (error) {
      console.error('Erro ao atualizar acomodação:', error.message)
      throw error
    }
  }

  // Excluir uma acomodação
  async remove(id: number): Promise<accommodations> {
    try {
      const accommodation = await this.prisma.accommodations.delete({
        where: { id },
      })
      return accommodation
    } catch (error) {
      console.error('Erro ao excluir acomodação:', error.message)
      throw error
    }
  }

  // Buscar todas as acomodações
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

  // Buscar acomodação por ID
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

  // Buscar acomodações por categoria
  async searchByCategory(category: string): Promise<any[]> {
    const validCategories = [
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

    if (!validCategories.includes(category)) {
      throw new Error('Categoria inválida')
    }

    return this.prisma.accommodations.findMany({
      where: {
        type: category as any, // Filtrando pelo tipo de acomodação
      },
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
  }

  // Buscar acomodações próximas por coordenadas
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

  // Buscar coordenadas de um CEP
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

  // Calcular a distância entre duas coordenadas
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371 // Raio da Terra em km
    const dLat = this.degToRad(lat2 - lat1)
    const dLon = this.degToRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) *
        Math.cos(this.degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distância em km
  }

  // Converter graus para radianos
  private degToRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  // Calcular a média das avaliações
  private calculateAverageRating(reviewsJson: unknown): number {
    const reviews = this.parseJson(reviewsJson)

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0
    }

    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
    return total / reviews.length
  }

  // Converter string JSON para objeto
  private parseJson(json: unknown): any {
    try {
      return typeof json === 'string' ? JSON.parse(json) : json
    } catch {
      return null
    }
  }
}
