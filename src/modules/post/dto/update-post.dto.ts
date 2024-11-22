import { IsOptional, IsArray, IsString, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ description: 'The title of the blog', required: false })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  title?: string;

  @ApiProperty({ description: 'The content of the blog', required: false })
  @IsOptional()
  @IsString()
  content?: string;

}
