import { IStoreContext } from "./store";
import { SIGN_IN_SUCCESS } from "./user/user.types";

export const rootReducer = (state: IStoreContext, action: any) => {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

rootReducer.initialState = {
  user: null,
};
