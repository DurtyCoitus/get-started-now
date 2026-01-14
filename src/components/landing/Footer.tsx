import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Market Watcher Pro</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Professional trading signal detection and paper trading platform. 
              Practice your strategies risk-free before trading with real capital.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#demo" className="hover:text-foreground transition-colors">Demo</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Get Started</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Market Watcher Pro. All rights reserved.</p>
          <p className="mt-2">
            Trading involves risk. Paper trading results may not reflect actual trading performance.
          </p>
        </div>
      </div>
    </footer>
  );
};
