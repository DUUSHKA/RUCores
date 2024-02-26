import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from "class-validator";

export class UserModel {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  isProvider: boolean;
}
