export class RegisterDto {
  companyName: string;
  email: string;
  phone: string;
  password: string;
  cacNumber?: string;
}

export class LoginDto {
  email: string;
  password: string;
}
