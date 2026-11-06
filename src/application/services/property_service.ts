import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { CreatePropertyDTO } from "../dtos/create_property_dto";
import { v4 as uuidv4 } from "uuid";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async createProperty(dto: CreatePropertyDTO): Promise<Property> {
    if (!dto.name || !dto.name.trim()) {
      throw new Error("O nome da propriedade é obrigatório.");
    }
    if (!Number.isFinite(dto.maxGuests) || dto.maxGuests <= 0) {
      throw new Error("A capacidade máxima deve ser maior que zero.");
    }

    const property = new Property(
      uuidv4(),
      dto.name,
      dto.description,
      dto.maxGuests,
      dto.basePricePerNight
    );
    await this.propertyRepository.save(property);
    return property;
  }

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }
}
