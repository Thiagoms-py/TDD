import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
  let entity: PropertyEntity;

  beforeEach(() => {
    entity = Object.assign(new PropertyEntity(), {
      id: "1",
      name: "Casa de praia",
      description: "Casa perto do mar",
      maxGuests: 4,
      basePricePerNight: 200,
    });
  });

  it("deve converter PropertyEntity em Property corretamente", () => {
    const property = PropertyMapper.toDomain(entity);

    expect(property).toBeInstanceOf(Property);
    expect(property.getId()).toBe(entity.id);
    expect(property.getName()).toBe(entity.name);
    expect(property.getDescription()).toBe(entity.description);
    expect(property.getMaxGuests()).toBe(entity.maxGuests);
    expect(property.getBasePricePerNight()).toBe(200);
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
    const { name, ...withoutName } = entity;
    const { basePricePerNight, ...withoutPrice } = entity;

    expect(() => PropertyMapper.toDomain(withoutName as PropertyEntity)).toThrow(
      "O nome é obrigatório"
    );
    expect(() => PropertyMapper.toDomain(withoutPrice as PropertyEntity)).toThrow(
      "O preço base por noite é obrigatório."
    );
  });

  it("deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property("1", "Casa de praia", "Casa perto do mar", 4, 200);
    const result = PropertyMapper.toPersistence(property);

    expect(result).toBeInstanceOf(PropertyEntity);
    expect(result).toMatchObject(entity);
  });
});
