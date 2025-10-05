import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, Min, ValidateNested } from 'class-validator';
import { CampaignGoal } from '@prisma/client';

class LineItemDto {
  @IsArray()
  public countryCodes!: string[];

  @IsArray()
  public devices!: string[];

  @IsArray()
  public contexts!: string[];

  @IsArray()
  public segments!: string[];
}

export class CreateCampaignDto {
  @IsNotEmpty()
  public name!: string;

  @IsDateString()
  public startAt!: string;

  @IsDateString()
  public endAt!: string;

  @IsInt()
  @Min(0)
  public dailyBudgetCents!: number;

  @IsInt()
  @Min(0)
  public totalBudgetCents!: number;

  @IsEnum(CampaignGoal)
  public goal!: CampaignGoal;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  public lineItems!: LineItemDto[];
}
