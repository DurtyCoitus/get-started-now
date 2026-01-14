import { motion } from "framer-motion";
import { 
  LineChart, 
  Zap, 
  Shield, 
  Bell, 
  Settings, 
  BarChart3,
  TrendingUp,
  Target
} from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Bollinger Bands Analysis",
    description: "Detect breakouts and mean reversion opportunities with customizable BB settings per symbol.",
  },
  {
    icon: BarChart3,
    title: "VWAP Tracking",
    description: "Volume-weighted average price crossovers for institutional-grade entry signals.",
  },
  {
    icon: Bell,
    title: "Real-Time Signals",
    description: "Get instant notifications when your watchlist triggers buy or sell conditions.",
  },
  {
    icon: Target,
    title: "Custom Signal Rules",
    description: "Create personalized trading rules with position sizing, stop-loss, and take-profit levels.",
  },
  {
    icon: Shield,
    title: "Paper Trading Mode",
    description: "Practice your strategies risk-free with simulated trades and realistic execution.",
  },
  {
    icon: TrendingUp,
    title: "Position Tracking",
    description: "Monitor all your positions with real-time P&L calculations and performance metrics.",
  },
  {
    icon: Zap,
    title: "Options Strategies",
    description: "Support for calls, puts, spreads, straddles, and iron condors.",
  },
  {
    icon: Settings,
    title: "Trading Settings",
    description: "Configure max position sizes, daily loss limits, and trading hours.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to Trade
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional-grade tools for technical analysis and automated signal detection.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-card rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
