import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTimeEntryDto {
  @IsDateString()
  @IsOptional()
  start?: string;

  @IsDateString()
  @IsOptional()
  end?: string;

  @IsString()
  @IsOptional()
  note?: string | null;
}

