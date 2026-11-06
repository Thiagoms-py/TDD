import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { UserService } from "../../application/services/user_service";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserController } from "./user_controller";

describe("UserController", () => {
  const app = express();
  app.use(express.json());
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqljs", synchronize: true,
      entities: [BookingEntity, PropertyEntity, UserEntity],
    });
    await dataSource.initialize();
    const repository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));
    const controller = new UserController(new UserService(repository));
    app.post("/users", (req, res, next) => {
      controller.createUser(req, res).catch(next);
    });
  });

  beforeEach(async () => {
    await dataSource.getRepository(UserEntity).clear();
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it("deve criar um usuário com sucesso", async () => {
    const response = await request(app).post("/users").send({ name: "Maria" });

    expect(response.status).toBe(201);
    expect(response.body.user).toEqual({ id: expect.any(String), name: "Maria" });
    expect(response.body.user.id).not.toBe("");
    const saved = await dataSource.getRepository(UserEntity).findOneBy({ id: response.body.user.id });
    expect(saved?.name).toBe("Maria");
  });

  it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/users").send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O campo nome é obrigatório.");
    expect(await dataSource.getRepository(UserEntity).count()).toBe(0);
  });
});
