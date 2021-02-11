import { createContext, useContext, useMemo } from "react";

export type Action = <T>(payload: T) => { type: string; payload: T };

export type User = firebase.default.User;

export interface IStoreContext {
  user: User | null;
}

export const StoreContext = createContext<[IStoreContext, React.Dispatch<any>]>(
  [{ user: null }, () => {}]
);

export const useSelector = <T>(cb: (s: IStoreContext) => T) => {
  const [store] = useContext(StoreContext);
  return cb(store) as T;
};

export const useDispatch = () => {
  const [, dispatch] = useContext(StoreContext);

  return useMemo(() => dispatch, [dispatch]);
};
