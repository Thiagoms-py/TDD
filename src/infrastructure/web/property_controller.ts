import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";

export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      const property = await this.propertyService.createProperty({
        name: req.body.name,
        description: req.body.description,
        maxGuests: req.body.maxGuests,
        basePricePerNight: req.body.basePricePerNight,
      });

      return res.status(201).json({
        message: "Propriedade criada com sucesso.",
        property: {
          id: property.getId(),
          name: property.getName(),
          description: property.getDescription(),
          maxGuests: property.getMaxGuests(),
          basePricePerNight: property.getBasePricePerNight(),
        },
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
