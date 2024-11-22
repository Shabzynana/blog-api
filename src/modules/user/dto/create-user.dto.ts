import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({ example: 'John', description: 'The first name of the user' })
    first_name: string;

    @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
    last_name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;
}