import { Exclude, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
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
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @IsOptional()
  user?: UserEntity | null; //This is just a foreign key reference, it will update as user changes

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  userJSON?: string; //Using the instanceToPlain decorator, we can preserve current state
}

@ChildEntity()
export class BookingEvent extends LogEntity {
  @IsNumber()
  @ManyToOne(() => BookingEntity, (booking) => booking.id, { nullable: true })
  @JoinColumn()
  booking: BookingEntity | null;

  //   @ValidateNested()
  //   @Type(() => FacilityEntity)
  //   @ManyToOne(() => FacilityEntity, (facility) => facility.id,  {nullable: true})
  //   facility: FacilityEntity | null;

  @Column()
  @IsNumber()
  balance: number;

  //   @Exclude()
  getName = () => "BookingEvent";
  //   log: Promise<FacilityEntity>;
}

@ChildEntity()
export class AvailabilityEvent extends LogEntity {
  @IsNumber()
  @ManyToOne(() => AvailabilityEntity, (availability) => availability.id, {
    nullable: true,
  })
  availability: AvailabilityEntity | null;

  //   @IsNumber()
  //   @ManyToOne(() => FacilityEntity, (facility) => facility.id,  {nullable: true})
  //   facility: FacilityEntity | null;

  @Exclude()
  getName = () => "AvailabilityEvent";
}

export enum modificatonType {
  create = "create",
  update = "update",
  delete = "delete",
}

export enum modificationEntity {
  user = "user",
  facility = "facility",
  booking = "booking",
  availability = "availability",
}

@ChildEntity()
export class ModificationEvent extends LogEntity {
  @IsOptional()
  //@ValidateNested()
  //@Type(() => FacilityEntity)
  //@ManyToOne(() => FacilityEntity, (facility) => facility.id, {nullable: true})
  @Column()
  @IsString()
  facility?: string;

  @IsOptional()
  //@ValidateNested()
  //@Type(() => BookingEntity)
  //@ManyToOne(() => BookingEntity, (booking) => booking.id)
  @Column()
  @IsString()
  booking?: string;

  @IsOptional()
  //@ValidateNested()
  //@Type(() => AvailabilityEntity)
  //@ManyToOne(() => AvailabilityEntity, (availability) => availability.id)
  @Column()
  @IsString()
  availability?: string;

  @Column({
    enum: modificatonType,
  })
  modificationType: modificatonType;

  @Column({
    enum: modificationEntity,
  })
  modificationEntity: modificationEntity;

  @Column()
  @IsOptional()
  @IsString()
  modificationEntityJSON: string;

  @Exclude()
  getName = () => "InfoEvent";
}
