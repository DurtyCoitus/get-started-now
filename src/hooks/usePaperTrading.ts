import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PaperTrade, Position, Order } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';
import { useTradingSettings } from './useTradingSettings';

export function usePaperTrading() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { settings } = useTradingSettings();

  const { data: paperTrades, isLoading } = useQuery({
    queryKey: ['paperTrades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paper_trades')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as PaperTrade[];
    },
  });

  const { data: paperPositions } = useQuery({
    queryKey: ['paperPositions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('is_paper_trade', true)
        .eq('is_open', true)
        .order('opened_at', { ascending: false });

      if (error) throw error;
      return data as Position[];
    },
    refetchInterval: 5000,
  });

  const executePaperTrade = useMutation({
    mutationFn: async ({
      symbol,
      side,
      quantity,
      price,
    }: {
      symbol: string;
      side: 'buy' | 'sell';
      quantity: number;
      price: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const totalValue = quantity * price;
      const commission = 0.65; // Standard commission per contract
      const currentBalance = settings?.paper_trading_balance || 100000;

      if (side === 'buy' && totalValue + commission > currentBalance) {
        throw new Error('Insufficient paper trading balance');
      }

      const newBalance = side === 'buy' 
        ? currentBalance - totalValue - commission
        : currentBalance + totalValue - commission;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          symbol,
          side,
          quantity,
          limit_price: price,
          filled_price: price,
          status: 'filled',
          is_paper_trade: true,
          filled_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create or update position
      if (side === 'buy') {
        const { error: posError } = await supabase
          .from('positions')
          .insert({
            user_id: user.id,
            order_id: order.id,
            symbol,
            quantity,
            avg_cost: price,
            current_price: price,
            is_paper_trade: true,
          });

        if (posError) throw posError;
      }

      // Record paper trade
      const { data: paperTrade, error: ptError } = await supabase
        .from('paper_trades')
        .insert({
          user_id: user.id,
          order_id: order.id,
          symbol,
          side,
          quantity,
          price,
          total_value: totalValue,
          commission,
          balance_after: newBalance,
        })
        .select()
        .single();

      if (ptError) throw ptError;

      // Update balance
      await supabase
        .from('trading_settings')
        .upsert({
          user_id: user.id,
          paper_trading_balance: newBalance,
        }, {
          onConflict: 'user_id',
        });

      return paperTrade;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paperTrades'] });
      queryClient.invalidateQueries({ queryKey: ['paperPositions'] });
      queryClient.invalidateQueries({ queryKey: ['tradingSettings'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: 'Paper trade executed',
        description: 'Your paper trade has been filled.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Trade failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const closePaperPosition = useMutation({
    mutationFn: async ({
      positionId,
      closePrice,
    }: {
      positionId: string;
      closePrice: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get position
      const { data: position, error: posError } = await supabase
        .from('positions')
        .select('*')
        .eq('id', positionId)
        .single();

      if (posError) throw posError;

      const totalValue = position.quantity * closePrice;
      const commission = 0.65;
      const realizedPnl = (closePrice - position.avg_cost) * position.quantity - commission * 2;
      const currentBalance = settings?.paper_trading_balance || 100000;
      const newBalance = currentBalance + totalValue - commission;

      // Close position
      const { error: closeError } = await supabase
        .from('positions')
        .update({
          is_open: false,
          current_price: closePrice,
          unrealized_pnl: realizedPnl,
          closed_at: new Date().toISOString(),
        })
        .eq('id', positionId);

      if (closeError) throw closeError;

      // Record paper trade
      const { data: paperTrade, error: ptError } = await supabase
        .from('paper_trades')
        .insert({
          user_id: user.id,
          position_id: positionId,
          symbol: position.symbol,
          side: 'sell',
          quantity: position.quantity,
          price: closePrice,
          total_value: totalValue,
          commission,
          realized_pnl: realizedPnl,
          balance_after: newBalance,
        })
        .select()
        .single();

      if (ptError) throw ptError;

      // Update balance
      await supabase
        .from('trading_settings')
        .upsert({
          user_id: user.id,
          paper_trading_balance: newBalance,
        }, {
          onConflict: 'user_id',
        });

      return paperTrade;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paperTrades'] });
      queryClient.invalidateQueries({ queryKey: ['paperPositions'] });
      queryClient.invalidateQueries({ queryKey: ['tradingSettings'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast({
        title: 'Position closed',
        description: 'Your paper position has been closed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to close position',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    paperTrades: paperTrades || [],
    paperPositions: paperPositions || [],
    paperBalance: settings?.paper_trading_balance || 100000,
    isLoading,
    executePaperTrade,
    closePaperPosition,
  };
}
