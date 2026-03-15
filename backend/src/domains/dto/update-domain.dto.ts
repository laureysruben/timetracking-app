import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDomainDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

