export class RegisterUserDTO {
  firstname: string;
  lastname: string;
  email?: string;
  telephone?: string;
  password?: string;
  salt?: string;
}

export class UpdateUserDTO {
  firstname: string;
  lastname: string;
  email?: string;
  telephone?: string;
  password?: string;
  salt?: string;
}

export class LoginUserDTO {
  loginId: string;
  password: string;
}

export class ResetPasswordDTO {
  loginId: string;
  token: string;
  password: string;

}

export class ForgotPasswordDTO {
  loginId: string;
}

export class ChangeUserPasswordDTO {
  oldPassword?: string;
  newPassword?: string;
}
