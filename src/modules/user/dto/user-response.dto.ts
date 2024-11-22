// export class SuccessCreateUserResponse {
//     status_code: number;
//     message: string;
//     data: {
//       user: {
//         first_name: string;
//         last_name: string;
//         email: string;
//         created_at: Date;
//       };
//     };
// }

// export class ErrorCreateUserResponse {
//     status_code: number;
//     message: string;
// }

import { ApiProperty } from '@nestjs/swagger';

export class SuccessCreateUserResponse {
  @ApiProperty({ example: 200, description: 'The HTTP status code of the response' })
  status_code: number;

  @ApiProperty({ example: 'User created successfully', description: 'The response message' })
  message: string;

  @ApiProperty({
    description: 'The response data containing the created user details',
    type: () => UserData, // Reference the inner data structure
  })
  data: {
    user: UserData;
  };
}

class UserData {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  last_name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({
    example: '2024-11-22T12:34:56Z',
    description: 'The date and time the user was created',
    type: Date,
  })
  created_at: Date;
}

export class ErrorCreateUserResponse {
  @ApiProperty({ example: 400, description: 'The HTTP status code of the error response' })
  status_code: number;

  @ApiProperty({
    example: 'Validation failed: email is required',
    description: 'A message describing the error',
  })
  message: string;
}

