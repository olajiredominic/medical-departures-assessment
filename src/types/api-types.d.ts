export interface RegisterUserDTO {
  firstname: string;
  lastname: string;
  email?: string;
  telephone?: string;
  password?: string;
}

export interface UpdateUserDTO {
  firstname: string;
  lastname: string;
  email?: string;
  telephone?: string;
}

export interface LoginUserDTO {
  loginId: string;
  password: string;
}

export interface ResetPasswordDTO {
  loginId: string;
  token: string;
  password: string;

}

export interface ForgotPasswordDTO {
  loginId: string;
}

export interface ChangeUserPasswordDTO {
  oldPassword?: string;
  newPassword?: string;
}
