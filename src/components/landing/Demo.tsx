import { motion } from "framer-motion";
import { Play, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const mockSignals = [
  {
    symbol: "AAPL",
    type: "bb_breakout_up",
    price: 187.45,
    time: "2 min ago",
    change: 2.34,
    action: "BUY CALL",
  },
  {
    symbol: "MSFT",
    type: "vwap_cross_down",
    price: 378.12,
    time: "5 min ago",
    change: -1.23,
    action: "BUY PUT",
  },
  {
    symbol: "GOOGL",
    type: "bb_mean_reversion_up",
    price: 141.89,
    time: "12 min ago",
    change: 0.87,
    action: "BUY CALL",
  },
  {
    symbol: "NVDA",
    type: "bb_breakout_up",
    price: 495.23,
    time: "18 min ago",
    change: 4.56,
    action: "BUY CALL",
  },
];

const mockPositions = [
  { symbol: "SPY", type: "CALL", strike: 480, expiry: "Jan 19", pnl: 234.50, pnlPercent: 12.3 },
  { symbol: "QQQ", type: "PUT", strike: 410, expiry: "Jan 26", pnl: -89.20, pnlPercent: -5.2 },
  { symbol: "TSLA", type: "CALL", strike: 250, expiry: "Feb 2", pnl: 567.80, pnlPercent: 23.4 },
];

export const Demo = () => {
  const [activeTab, setActiveTab] = useState<"signals" | "positions">("signals");

  return (
    <section id="demo" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Play className="w-4 h-4" />
            Live Demo
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-muted-foreground">
            Real-time signal detection and position tracking in a clean, intuitive interface.
          </p>
        </motion.div>

        {/* Demo Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass-card rounded-2xl overflow-hidden border-2 border-border/50">
            {/* Window Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                Paper Trading Mode
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                $100,000 Balance
              </Badge>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-border bg-card/30">
              <button
                onClick={() => setActiveTab("signals")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "signals"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Live Signals
              </button>
              <button
                onClick={() => setActiveTab("positions")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "positions"
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Open Positions
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[400px] bg-background/50">
              {activeTab === "signals" ? (
                <div className="space-y-4">
                  {mockSignals.map((signal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          signal.change > 0 ? "bg-primary/10" : "bg-destructive/10"
                        }`}>
                          {signal.change > 0 ? (
                            <TrendingUp className="w-5 h-5 text-primary" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{signal.symbol}</span>
                            <Badge variant="secondary" className="text-xs">
                              {signal.type.replace(/_/g, " ").toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ${signal.price.toFixed(2)} • {signal.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-medium ${
                          signal.change > 0 ? "text-primary" : "text-destructive"
                        }`}>
                          {signal.change > 0 ? "+" : ""}{signal.change.toFixed(2)}%
                        </span>
                        <Button size="sm" className="bg-gradient-primary">
                          {signal.action}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockPositions.map((position, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          position.type === "CALL" ? "bg-primary/10" : "bg-accent/10"
                        }`}>
                          <span className={`font-bold text-sm ${
                            position.type === "CALL" ? "text-primary" : "text-accent"
                          }`}>
                            {position.type[0]}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-lg">{position.symbol}</span>
                          <p className="text-sm text-muted-foreground">
                            ${position.strike} {position.type} • {position.expiry}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          position.pnl > 0 ? "text-primary" : "text-destructive"
                        }`}>
                          {position.pnl > 0 ? "+" : ""}${position.pnl.toFixed(2)}
                        </p>
                        <p className={`text-sm ${
                          position.pnlPercent > 0 ? "text-primary" : "text-destructive"
                        }`}>
                          {position.pnlPercent > 0 ? "+" : ""}{position.pnlPercent.toFixed(1)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
