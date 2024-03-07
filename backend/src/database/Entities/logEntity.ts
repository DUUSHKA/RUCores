import { Exclude, Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  TableInheritance,
} from "typeorm";
import LogType from "../../types/LogType";
import { AvailabilityEntity } from "./availabilityEntity";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";
import { UserEntity } from "./userEntity";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class LogEntity extends GenericEntity {
  @Column({
    default: LogType.ModificationEvent,
  })
  LogType: LogType; //discriminator column

  @Column()
  @IsString()
  @IsOptional()
  message?: string;

  @Type(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}

@ChildEntity()
export class BookingEvent extends LogEntity {
  @Column()
  @IsNumber()
  @ManyToOne(() => BookingEntity, (booking) => booking.id)
  @JoinColumn()
  bookingID: number;

  @ValidateNested()
  @Type(() => FacilityEntity)
  @ManyToOne(() => FacilityEntity, (facility) => facility.id)
  facility: FacilityEntity;

  @Column()
  @IsNumber()
  balance: number;

  @Exclude()
  getName = () => "BookingEvent";
}

@ChildEntity()
export class AvailabilityEvent extends LogEntity {
  @Column()
  @IsNumber()
  @ManyToOne(() => AvailabilityEntity, (availability) => availability.id)
  availabilityID: number;

  @IsNumber()
  @ManyToOne(() => FacilityEntity, (facility) => facility.id)
  facility: FacilityEntity;

  @Exclude()
  getName = () => "AvailabilityEvent";
}

export enum modificatonType {
  create = "create",
  update = "update",
  delete = "delete",
}

@ChildEntity()
export class ModificationEvent extends LogEntity {
  @ValidateNested()
  @Type(() => FacilityEntity)
  @ManyToOne(() => FacilityEntity, (facility) => facility.id)
  facility: FacilityEntity;

  @Column({
    enum: modificatonType,
  })
  modificationType: modificatonType;

  @Column()
  @IsString()
  json: string;

  @Exclude()
  getName = () => "InfoEvent";
}
