import { User } from "../entites/user.entity";
import { UserData } from "../dto/user-response.dto";
  
export const formatUser = (user: User): UserData => {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
    };
};
  
  