import { createContext, useContext } from "react";
import { WishlistState, WishlistAction } from "@/lib/wishes/types";
import { Dispatch } from "react";

export const INITIAL_STATE: WishlistState = {
  wishItems: [],
  filter: {
    priorities: [],
    status: null,
  },
  errors: {},
  selectedWishes: [],
  ui: {
    darkMode: false,
    bulkSelectionMode: false,
  },
};

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
