import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
    @ApiProperty()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    last_name: string;

    // @ApiProperty({
    //     description: 'The email address of the user',
    //     example: 'user@example.com',
    // })
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}

