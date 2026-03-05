import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { truncateWallet } from "@/lib/format";

const Navbar = () => {
  const { isConnected, wallet, connectWallet, disconnectWallet } = useApp();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-heading italic text-2xl font-semibold tracking-wide text-foreground"
        >
          Arteva
        </Link>

        <div className="flex items-center gap-6">
          {isConnected && (
            <Link
              to="/list"
              className="text-sm text-text-secondary hover:text-foreground transition-colors duration-500"
            >
              List Artwork
            </Link>
          )}

          {isConnected && wallet ? (
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-2 px-3 py-1.5 border border-accent/30 rounded-full text-sm hover:border-accent transition-colors duration-500"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold to-muted" />
              <span className="font-mono text-xs">
                {truncateWallet(wallet)}
              </span>
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="px-4 py-1.5 border border-accent/40 rounded-full text-sm text-foreground hover:border-accent hover:bg-accent/5 transition-all duration-500"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
