import { motion } from "framer-motion";
import { ListPlus, Gauge, Bell, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: ListPlus,
    step: "01",
    title: "Build Your Watchlist",
    description: "Add symbols you want to monitor with customized Bollinger Band and VWAP settings for each.",
  },
  {
    icon: Gauge,
    step: "02",
    title: "Configure Signal Rules",
    description: "Set up your trading rules with position sizing, stop-loss levels, and preferred option strategies.",
  },
  {
    icon: Bell,
    step: "03",
    title: "Receive Signals",
    description: "Get notified when technical conditions are met—BB breakouts, mean reversions, or VWAP crosses.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Execute & Track",
    description: "Paper trade to test your strategy or connect to a live broker. Track positions and P&L in real-time.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Trading in 4 Steps
          </h2>
          <p className="text-xl text-muted-foreground">
            From setup to execution in minutes. No complex configuration required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="glass-card rounded-2xl p-6 h-full relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-2 text-6xl font-bold text-primary/10">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 border border-primary/30">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connector Dot (for desktop) */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-20" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
