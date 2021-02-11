import { useReducer } from "react";
import { rootReducer } from "./rootReducer";
import { StoreContext } from "./store";

export const PreduxProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, rootReducer.initialState);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};
