import { IsEmail, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class forgotPasswordDto {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

}

