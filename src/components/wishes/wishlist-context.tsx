import { wishlistReducer } from "@/lib/wishes/reducer";
import { WishlistContext } from "@/hooks/use-wishlist";
import { WishlistState } from "@/lib/wishes/types";
import { useReducer } from "react";
import { ReactNode } from "react";

const INITIAL_STATE: WishlistState = {
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

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wishlistReducer, INITIAL_STATE);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};
