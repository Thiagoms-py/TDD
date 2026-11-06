import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyService } from "../../application/services/property_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyController } from "./property_controller";

describe("PropertyController", () => {
  const app = express();
  app.use(express.json());
  let dataSource: DataSource;
  const property = {
    name: "Casa de praia", description: "Casa perto do mar",
    maxGuests: 4, basePricePerNight: 200,
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqljs", synchronize: true,
      entities: [BookingEntity, PropertyEntity, UserEntity],
    });
    await dataSource.initialize();
    const repository = new TypeORMPropertyRepository(dataSource.getRepository(PropertyEntity));
    const controller = new PropertyController(new PropertyService(repository));
    app.post("/properties", (req, res, next) => {
      controller.createProperty(req, res).catch(next);
    });
  });

  beforeEach(async () => {
    await dataSource.getRepository(PropertyEntity).clear();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it("deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/properties").send(property);

    expect(response.status).toBe(201);
    expect(response.body.property).toEqual({ id: expect.any(String), ...property });
    expect(response.body.property.id).not.toBe("");
    const saved = await dataSource.getRepository(PropertyEntity).findOneBy({ id: response.body.property.id });
    expect(saved).toMatchObject(property);
  });

  it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/properties").send({ ...property, name: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O nome da propriedade é obrigatório.");
    expect(await dataSource.getRepository(PropertyEntity).count()).toBe(0);
  });

  it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    for (const maxGuests of [0, -1]) {
      const response = await request(app).post("/properties").send({ ...property, maxGuests });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("A capacidade máxima deve ser maior que zero.");
    }
    expect(await dataSource.getRepository(PropertyEntity).count()).toBe(0);
  });

  it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const { basePricePerNight, ...withoutPrice } = property;
    const response = await request(app).post("/properties").send(withoutPrice);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O preço base por noite é obrigatório.");
    expect(await dataSource.getRepository(PropertyEntity).count()).toBe(0);
  });

  it("deve retornar erro com código 400 ao enviar preço base por noite igual a zero ou negativo", async () => {
    for (const basePricePerNight of [0, -100]) {
      const response = await request(app).post("/properties").send({ ...property, basePricePerNight });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("O preço base por noite deve ser maior que zero.");
    }
    expect(await dataSource.getRepository(PropertyEntity).count()).toBe(0);
  });
});
