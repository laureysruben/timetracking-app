import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateTimeEntryDto {
  @IsInt()
  @Min(1)
  taskId: number;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsString()
  @IsOptional()
  note?: string;
}

