import {IUser} from "../models/User";

export type IUserPublic = Omit<IUser, 'password' | '__v' | 'save'>;

