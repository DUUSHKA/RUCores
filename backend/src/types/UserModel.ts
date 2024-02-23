import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class UserModel {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
