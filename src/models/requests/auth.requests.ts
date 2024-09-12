export interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}
