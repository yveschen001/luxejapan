import { IsString, IsArray, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class CreateMatchDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '目标性别', enum: Gender })
  @IsEnum(Gender)
  targetGender: Gender;

  @ApiProperty({ description: '目标年龄范围', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(18, { each: true })
  @Max(100, { each: true })
  targetAgeRange: [number, number];

  @ApiProperty({ description: '匹配偏好', required: false })
  @IsString()
  preferences?: string;
} 