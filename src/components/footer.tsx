import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center text-xs text-muted-foreground">
        <p>
          &copy; 2024 Wishlist Manager by Isai Sanchez. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://isais.dev/blog/wishlist-app"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            How I built this
          </a>
          <a
            href="https://github.com/isai7710/wishlist-app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-foreground transition-colors"
          >
            <span>Source</span>
            <Github height={14} width={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
