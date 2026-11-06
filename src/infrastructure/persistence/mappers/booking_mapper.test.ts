import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";

describe("BookingMapper", () => {
  let entity: BookingEntity;

  beforeEach(() => {
    entity = Object.assign(new BookingEntity(), {
      id: "1",
      property: Object.assign(new PropertyEntity(), {
        id: "2", name: "Casa", description: "Casa de praia",
        maxGuests: 4, basePricePerNight: 200,
      }),
      guest: Object.assign(new UserEntity(), { id: "3", name: "Maria" }),
      startDate: new Date("2026-12-10"),
      endDate: new Date("2026-12-12"),
      guestCount: 2,
      totalPrice: 400,
      status: "CONFIRMED",
    });
  });

  it("deve converter BookingEntity em Booking corretamente", () => {
    entity.status = "CANCELLED";
    entity.totalPrice = 200;
    const booking = BookingMapper.toDomain(entity);

    expect(booking).toBeInstanceOf(Booking);
    expect(booking.getId()).toBe(entity.id);
    expect(booking.getProperty().getId()).toBe(entity.property.id);
    expect(booking.getGuest().getId()).toBe(entity.guest.id);
    expect(booking.getDateRange().getStartDate()).toEqual(entity.startDate);
    expect(booking.getDateRange().getEndDate()).toEqual(entity.endDate);
    expect(booking.getGuestCount()).toBe(2);
    expect(booking.getTotalPrice()).toBe(200);
    expect(booking.getStatus()).toBe("CANCELLED");
  });

  it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const { name, ...guestWithoutName } = entity.guest;
    entity.guest = guestWithoutName as UserEntity;

    expect(() => BookingMapper.toDomain(entity)).toThrow("O nome é obrigatório");
  });

  it("deve converter Booking para BookingEntity corretamente", () => {
    const booking = new Booking(
      "1", new Property("2", "Casa", "Casa de praia", 4, 200),
      new User("3", "Maria"), new DateRange(entity.startDate, entity.endDate), 2
    );
    const result = BookingMapper.toPersistence(booking);

    expect(result).toBeInstanceOf(BookingEntity);
    expect(result).toEqual(entity);
  });
});
