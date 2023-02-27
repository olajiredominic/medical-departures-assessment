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

export interface GenericResponseVO {
  statusCode: number;
  body: string;
}
export interface LoginResponseDTO {
  code: number;
  message: string;
  data?: {
    token: string;
  }
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

export interface UserProfileResponseDTO {
  code: number;
  message: string;
  data?: {
    firstname: string;
    lastname: string;
    email?: string;
    telephone?: string;
  }

}
