import { TUser } from "./user.type";


// login data
export type Ilogin = {
  email: string;
  password: string;
};


export type TAuthData = {
  redirect: boolean;
  token: string;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};