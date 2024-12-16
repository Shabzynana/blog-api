import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
       
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    new_password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    confirm_password: string;
}

