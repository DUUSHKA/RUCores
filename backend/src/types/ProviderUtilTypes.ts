import { IsNumber, IsString } from "class-validator";

class ProviderIDMapping {
  @IsString()
  username: string;

  @IsNumber()
  id: number;
}

export { ProviderIDMapping };
