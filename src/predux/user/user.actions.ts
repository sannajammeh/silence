import { Action } from "../store";
import { SIGN_IN_SUCCESS } from "./user.types";

export const signInSuccess: Action = (user) => {
  return { type: SIGN_IN_SUCCESS, payload: user };
};
