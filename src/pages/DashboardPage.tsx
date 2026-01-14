import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTradingSettings } from '@/hooks/useTradingSettings';
import { usePaperTrading } from '@/hooks/usePaperTrading';
import { useWatchlist } from '@/hooks/useWatchlist';
import { formatPrice } from '@/lib/indicators';
import { Loader2, TrendingUp, LogOut, Wallet, BarChart3, List, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { settings } = useTradingSettings();
  const { paperBalance, paperPositions } = usePaperTrading();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Market Watcher Pro</h1>
                <p className="text-sm text-muted-foreground">Paper Trading Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2 py-1.5 px-3">
                <Wallet className="h-4 w-4" />
                {formatPrice(paperBalance)}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                Paper Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(paperBalance)}</div>
              <p className="text-xs text-muted-foreground mt-1">Available for trading</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Open Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paperPositions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active paper trades</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                Watchlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchlist.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Symbols tracked</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Market Watcher Pro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your paper trading dashboard is ready. Start by adding symbols to your watchlist and configuring signal rules.
            </p>
            <div className="flex gap-3">
              <Button className="bg-gradient-primary">
                <DollarSign className="h-4 w-4 mr-2" />
                Execute Paper Trade
              </Button>
              <Button variant="outline">
                Add to Watchlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
