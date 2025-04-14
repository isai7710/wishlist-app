import { createContext, useContext } from "react";
import { WishlistState, WishlistAction } from "@/lib/wishes/types";
import { Dispatch } from "react";

interface WishlistContextType {
  state: WishlistState;
  dispatch: Dispatch<WishlistAction>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
