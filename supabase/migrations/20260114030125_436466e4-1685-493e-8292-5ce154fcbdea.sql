-- Create enums for trading types
CREATE TYPE public.signal_type AS ENUM (
  'bb_breakout_up',
  'bb_breakout_down',
  'bb_mean_reversion_up',
  'bb_mean_reversion_down',
  'vwap_cross_up',
  'vwap_cross_down',
  'custom'
);

CREATE TYPE public.order_side AS ENUM ('buy', 'sell');
CREATE TYPE public.order_status AS ENUM ('pending', 'submitted', 'filled', 'partial', 'cancelled', 'rejected');
CREATE TYPE public.option_type AS ENUM ('call', 'put');
CREATE TYPE public.option_strategy AS ENUM (
  'buy_call',
  'buy_put',
  'sell_call',
  'sell_put',
  'bull_call_spread',
  'bear_put_spread',
  'iron_condor',
  'straddle',
  'strangle'
);
CREATE TYPE public.broker_type AS ENUM ('ibkr', 'paper');

-- Watchlist table
CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  bb_period INTEGER NOT NULL DEFAULT 20,
  bb_std_dev NUMERIC(3,2) NOT NULL DEFAULT 2.0,
  vwap_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);

ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watchlist"
  ON public.watchlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create watchlist items"
  ON public.watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their watchlist"
  ON public.watchlist FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from watchlist"
  ON public.watchlist FOR DELETE
  USING (auth.uid() = user_id);

-- Signal Rules table
CREATE TABLE public.signal_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  signal_type signal_type NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  option_strategy option_strategy NOT NULL,
  strike_offset_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  expiry_days INTEGER NOT NULL DEFAULT 7,
  position_size_percent NUMERIC(5,2) NOT NULL DEFAULT 5.0,
  max_position_value NUMERIC(12,2) NOT NULL DEFAULT 10000.00,
  trailing_stop_percent NUMERIC(5,2) DEFAULT NULL,
  stop_loss_percent NUMERIC(5,2) DEFAULT NULL,
  take_profit_percent NUMERIC(5,2) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.signal_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own signal rules"
  ON public.signal_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create signal rules"
  ON public.signal_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their signal rules"
  ON public.signal_rules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete signal rules"
  ON public.signal_rules FOR DELETE
  USING (auth.uid() = user_id);

-- Signals table
CREATE TABLE public.signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  watchlist_id UUID REFERENCES public.watchlist(id) ON DELETE SET NULL,
  signal_rule_id UUID REFERENCES public.signal_rules(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL,
  signal_type signal_type NOT NULL,
  price_at_signal NUMERIC(12,4) NOT NULL,
  bb_upper NUMERIC(12,4),
  bb_lower NUMERIC(12,4),
  bb_middle NUMERIC(12,4),
  vwap NUMERIC(12,4),
  volume BIGINT,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  executed BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own signals"
  ON public.signals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create signals"
  ON public.signals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their signals"
  ON public.signals FOR UPDATE
  USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  signal_id UUID REFERENCES public.signals(id) ON DELETE SET NULL,
  ibkr_order_id TEXT,
  symbol TEXT NOT NULL,
  option_type option_type,
  strike NUMERIC(12,2),
  expiry DATE,
  side order_side NOT NULL,
  quantity INTEGER NOT NULL,
  limit_price NUMERIC(12,4),
  filled_price NUMERIC(12,4),
  status order_status NOT NULL DEFAULT 'pending',
  strategy option_strategy,
  trailing_stop_percent NUMERIC(5,2),
  stop_loss_price NUMERIC(12,4),
  take_profit_price NUMERIC(12,4),
  is_paper_trade BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  filled_at TIMESTAMPTZ
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Positions table
CREATE TABLE public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL,
  option_type option_type,
  strike NUMERIC(12,2),
  expiry DATE,
  quantity INTEGER NOT NULL,
  avg_cost NUMERIC(12,4) NOT NULL,
  current_price NUMERIC(12,4),
  unrealized_pnl NUMERIC(12,4),
  trailing_stop_price NUMERIC(12,4),
  stop_loss_price NUMERIC(12,4),
  take_profit_price NUMERIC(12,4),
  is_open BOOLEAN NOT NULL DEFAULT true,
  is_paper_trade BOOLEAN NOT NULL DEFAULT false,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own positions"
  ON public.positions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create positions"
  ON public.positions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their positions"
  ON public.positions FOR UPDATE
  USING (auth.uid() = user_id);

-- Trading Settings table
CREATE TABLE public.trading_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  auto_trade_enabled BOOLEAN NOT NULL DEFAULT false,
  max_daily_trades INTEGER NOT NULL DEFAULT 10,
  max_daily_loss NUMERIC(12,2) NOT NULL DEFAULT 1000.00,
  max_position_size NUMERIC(12,2) NOT NULL DEFAULT 10000.00,
  trading_hours_start TIME NOT NULL DEFAULT '09:30:00',
  trading_hours_end TIME NOT NULL DEFAULT '16:00:00',
  paper_trading_enabled BOOLEAN NOT NULL DEFAULT true,
  paper_trading_balance NUMERIC(14,2) NOT NULL DEFAULT 100000.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trading_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON public.trading_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their settings"
  ON public.trading_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their settings"
  ON public.trading_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Paper Trading Transactions table (for tracking paper trade history)
CREATE TABLE public.paper_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL,
  side order_side NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(12,4) NOT NULL,
  total_value NUMERIC(14,4) NOT NULL,
  commission NUMERIC(8,4) NOT NULL DEFAULT 0,
  realized_pnl NUMERIC(12,4),
  balance_after NUMERIC(14,2) NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.paper_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own paper trades"
  ON public.paper_trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create paper trades"
  ON public.paper_trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Broker Sessions table (for IBKR connection)
CREATE TABLE public.broker_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  broker broker_type NOT NULL DEFAULT 'paper',
  session_token TEXT,
  refresh_token TEXT,
  credentials_encrypted TEXT,
  is_authenticated BOOLEAN NOT NULL DEFAULT false,
  last_authenticated TIMESTAMPTZ,
  account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.broker_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own broker session"
  ON public.broker_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create broker session"
  ON public.broker_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their broker session"
  ON public.broker_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_watchlist_updated_at
  BEFORE UPDATE ON public.watchlist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signal_rules_updated_at
  BEFORE UPDATE ON public.signal_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trading_settings_updated_at
  BEFORE UPDATE ON public.trading_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broker_sessions_updated_at
  BEFORE UPDATE ON public.broker_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();