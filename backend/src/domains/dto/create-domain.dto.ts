import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDomainDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

