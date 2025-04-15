import { getFilteredWishes } from "@/lib/wishes/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import WishlistForm from "@/components/wishes/wishlist-form";
import BulkActions from "@/components/wishes/bulk-actions";
import WishlistItem from "@/components/wishes/wishlist-item";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useWishlist } from "./hooks/use-wishlist";
import { useEffect } from "react";

export default function WishlistApp() {
  const { state } = useWishlist();
  useEffect(() => {
    if (state.ui.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.ui.darkMode]);
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <WishlistForm />

          <Card>
            <BulkActions />
            <CardContent className="px-4 py-2 space-y-2">
              {state.wishItems.length === 0 ? (
                <p className="text-center text-muted-foreground mb-4">
                  No items in the wishlist
                </p>
              ) : (
                <>
                  {getFilteredWishes(state.wishItems, state.filter).map(
                    (wish) => (
                      <WishlistItem key={wish.id} wish={wish} />
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
