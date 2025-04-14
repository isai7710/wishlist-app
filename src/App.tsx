import { useReducer, useState } from "react";
import { wishlistReducer } from "@/lib/wishes/reducer";
import { getFilteredWishes } from "@/lib/wishes/utils";
import { WishlistState } from "@/lib/wishes/types";

import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import WishlistForm from "@/components/wishes/wishlist-form";
import BulkActions from "@/components/wishes/bulk-actions";
import WishlistItem from "@/components/wishes/wishlist-item";
import Header from "@/components/header";
import Footer from "@/components/footer";

const initialState: WishlistState = {
  wishItems: [],
  filter: {
    priorities: [],
    status: null,
  },
  errors: {},
  selectedWishes: [],
};

export default function WishlistApp() {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const [darkMode, setDarkMode] = useState(false);
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${darkMode ? "dark" : ""}`}
    >
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <WishlistForm
            errors={state.errors}
            dispatch={dispatch}
            filter={state.filter}
          />

          <Card>
            <BulkActions
              selectedWishes={state.selectedWishes}
              wishes={state.wishItems}
              dispatch={dispatch}
              bulkSelectionMode={bulkSelectionMode}
              setBulkSelectionMode={setBulkSelectionMode}
            />
            <CardContent className="px-4 py-2 space-y-2">
              {state.wishItems.length === 0 ? (
                <p className="text-center text-muted-foreground mb-4">
                  No items in the wishlist
                </p>
              ) : (
                <>
                  {getFilteredWishes(state.wishItems, state.filter).map(
                    (wish) => (
                      <WishlistItem
                        key={wish.id}
                        wish={wish}
                        selectedWishes={state.selectedWishes}
                        dispatch={dispatch}
                        bulkSelectionMode={bulkSelectionMode}
                        setBulkSelectionMode={setBulkSelectionMode}
                      />
                    ),
                  )}
                  {getFilteredWishes(state.wishItems, state.filter).length ===
                    0 && (
                    <p className="text-center text-muted-foreground mb-4">
                      No items match the current filters
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
