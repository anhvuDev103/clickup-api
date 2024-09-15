export interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
  otp_code: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}
