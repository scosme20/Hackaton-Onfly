import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { accommodations_type } from '@prisma/client'
import axios from 'axios'

@Injectable()
export class AccommodationsService {
  private readonly openCageApiKey = '649ce940f26944148f28236a9fa44f32'

  constructor(private readonly prisma: PrismaService) {}

  // Método para encontrar todas as acomodações
  async findAll() {
    const accommodations = await this.prisma.accommodations.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        description: true,
        stars: true,
        thumb: true,
        amenities: true,
        type: true,
      },
    })

    return accommodations.map((accommodation) => ({
      id: accommodation.id,
      name: accommodation.name,
      type: accommodation.type,
      city: accommodation.city,
      state: accommodation.state,
      description: accommodation.description,
      stars: accommodation.stars,
      image: accommodation.thumb,
      amenities:
        typeof accommodation.amenities === 'string'
          ? JSON.parse(accommodation.amenities) // Parse somente se for uma string
          : accommodation.amenities, // Caso já seja um objeto JSON, não é necessário parsear
    }))
  }

  // Método para encontrar uma acomodação pelo ID
  async findById(id: number) {
    const accommodation = await this.prisma.accommodations.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        description: true,
        reviews: true,
        thumb: true,
        amenities: true,
        type: true,
      },
    })

    if (!accommodation) {
      throw new InternalServerErrorException('Acomodação não encontrada')
    }

    return {
      id: accommodation.id,
      name: accommodation.name,
      city: accommodation.city,
      state: accommodation.state,
      type: accommodation.type,
      description: accommodation.description,
      image: accommodation.thumb,
      amenities:
        typeof accommodation.amenities === 'string'
          ? JSON.parse(accommodation.amenities) // Parse somente se for uma string
          : accommodation.amenities, // Caso já seja um objeto JSON, não é necessário parsear
    }
  }

  // Método para buscar acomodações por categoria
  async searchByCategory(category: string) {
    return this.prisma.accommodations.findMany({
      where: {
        type: category as accommodations_type,
      },
      select: {
        id: true,
        name: true,
        type: true,
        city: true,
        state: true,
        description: true,
        stars: true,
        thumb: true,
        amenities: true,
      },
    })
  }
}
