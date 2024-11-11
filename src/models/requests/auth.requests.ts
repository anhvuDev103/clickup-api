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

export interface LogOutRequestBody {
  refresh_token: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface ResetPasswordRequestBody {
  forgot_password_token: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordRequestBody {
  current_password: string;
  new_password: string;
}

export interface RefreshTokenRequestBody {
  refresh_token: string;
}
