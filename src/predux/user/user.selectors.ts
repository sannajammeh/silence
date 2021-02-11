import { IStoreContext } from "../store";

export const selectUser = (state: IStoreContext) => {
  return state.user;
};
