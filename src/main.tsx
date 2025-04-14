import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WishlistApp from "./App.tsx";
import { WishlistProvider } from "./components/wishes/wishlist-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WishlistProvider>
      <WishlistApp />
    </WishlistProvider>
  </StrictMode>,
);
