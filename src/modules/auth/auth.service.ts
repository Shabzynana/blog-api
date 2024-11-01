import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {

    signup() {
        return {"msg": "signup lfg"}
    }

    signin() {
        return {"msg": "signin lfg, we up"}
    }
    
}