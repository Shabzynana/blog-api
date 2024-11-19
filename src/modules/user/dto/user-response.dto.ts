export class SuccessCreateUserResponse {
    status_code: number;
    message: string;
    data: {
      user: {
        first_name: string;
        last_name: string;
        email: string;
        created_at: Date;
      };
    };
}

export class ErrorCreateUserResponse {
    status_code: number;
    message: string;
}