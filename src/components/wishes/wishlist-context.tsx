import { wishlistReducer } from "@/lib/wishes/reducer";
import { WishlistContext, INITIAL_STATE } from "@/hooks/use-wishlist";
import { useReducer } from "react";
import { ReactNode } from "react";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wishlistReducer, INITIAL_STATE);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};
