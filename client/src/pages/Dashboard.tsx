import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  DollarSign,
  Clock,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { RevenueGraph } from '../components/dashboard/RevenueGraph';
import { OrderTracker } from '../components/dashboard/OrderTracker';
import { RecipeManager } from '../components/dashboard/RecipeManager';
import type { CreatorMetrics, RevenueDataPoint, CreatorOrder, TopRecipeItem } from '../types/dashboard';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'recipes' | 'payouts'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<CreatorMetrics>({
    totalRevenue: 1420.5,
    totalOrdersCount: 38,
    activeOrdersCount: 4,
    completedOrdersCount: 32,
    publishedRecipesCount: 12,
  });
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([
    { date: 'Jan', revenue: 240 },
    { date: 'Feb', revenue: 450 },
    { date: 'Mar', revenue: 380 },
    { date: 'Apr', revenue: 720 },
    { date: 'May', revenue: 610 },
    { date: 'Jun', revenue: 950 },
    { date: 'Jul', revenue: 1420.5 },
  ]);
  const [orders, setOrders] = useState<CreatorOrder[]>([
    {
      _id: 'ord_101298a',
      customer: { _id: 'c1', username: 'alex_gourmet', email: 'alex@taste.com' },
      creator: 'me',
      items: [
        {
          recipeId: {
            _id: 'r1',
            title: 'Truffle Mushroom Risotto',
            category: 'Main Dish',
            pricing: { price: 18.5, isOrderable: true },
          },
          portionSize: 'Standard (450g)',
          customAddons: ['Extra Parmesan', 'Truffle Oil'],
          quantity: 2,
          price: 18.5,
        },
      ],
      totalAmount: 42.0,
      deliveryFee: 5.0,
      razorpayOrderId: 'order_M1k8a923',
      orderStatus: 'Preparing',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'ord_101297b',
      customer: { _id: 'c2', username: 'sarah_bakes', email: 'sarah@taste.com' },
      creator: 'me',
      items: [
        {
          recipeId: {
            _id: 'r2',
            title: 'Artisanal Sourdough Pizza',
            category: 'Street Food',
            pricing: { price: 15.0, isOrderable: true },
          },
          portionSize: 'Large (12")',
          customAddons: ['Fresh Basil'],
          quantity: 1,
          price: 15.0,
        },
      ],
      totalAmount: 20.0,
      deliveryFee: 5.0,
      razorpayOrderId: 'order_M1k8a924',
      orderStatus: 'Out for Delivery',
      createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [recipes, setRecipes] = useState<TopRecipeItem[]>([
    {
      id: 'r1',
      title: 'Truffle Mushroom Risotto',
      category: 'Main Dish',
      price: 18.5,
      isOrderable: true,
      likesCount: 142,
      ordersCount: 28,
      averageRating: 4.9,
      status: 'published',
    },
    {
      id: 'r2',
      title: 'Artisanal Sourdough Pizza',
      category: 'Street Food',
      price: 15.0,
      isOrderable: true,
      likesCount: 98,
      ordersCount: 19,
      averageRating: 4.8,
      status: 'published',
    },
    {
      id: 'r3',
      title: 'Dark Chocolate Lava Cake',
      category: 'Desserts',
      price: 9.5,
      isOrderable: false,
      likesCount: 210,
      ordersCount: 0,
      averageRating: 5.0,
      status: 'published',
    },
  ]);

  useEffect(() => {
    // Fetch metrics from backend API if running with live database
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/dashboard/metrics');
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
        if (data.revenueGraphData?.length) setRevenueData(data.revenueGraphData);
        if (data.topRecipes?.length) setRecipes(data.topRecipes);
      }

      const ordersRes = await fetch('/api/v1/dashboard/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.orders) setOrders(ordersData.orders);
      }
    } catch (e) {
      console.log('Using local fallback state for creator dashboard view');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: CreatorOrder['orderStatus']) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
    );

    try {
      await fetch(`/api/v1/dashboard/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error('Failed to sync order status update with server');
    }
  };

  const handleToggleOrderable = async (recipeId: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipeId ? { ...r, isOrderable: !r.isOrderable } : r))
    );

    try {
      await fetch(`/api/v1/dashboard/recipes/${recipeId}/toggle-orderable`, {
        method: 'PATCH',
      });
    } catch (e) {
      console.error('Failed to toggle orderable status');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[var(--bg-surface)] border-r border-[var(--border-muted)]/30 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-primary-2)] flex items-center justify-center font-black text-xl shadow-lg shadow-[var(--accent-primary)]/20">
              T
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-lg text-white">TasteCraft</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-secondary)] px-2 py-0.5 rounded-full bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20">
                Creator Studio
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </div>
              {metrics.activeOrdersCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-400 text-black font-extrabold">
                  {metrics.activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'recipes'
                  ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Recipes</span>
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'payouts'
                  ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Payouts & Earnings</span>
            </button>
          </nav>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-white/10">
          <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary-2)] font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-lg shadow-[var(--accent-primary)]/20 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            <span>Create Recipe</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white capitalize">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Active & Incoming Orders'}
              {activeTab === 'recipes' && 'Recipe Catalog Management'}
              {activeTab === 'payouts' && 'Revenue & Payout History'}
            </h2>
            <p className="text-xs text-[var(--text-body)] mt-1">
              Welcome back, Gourmet Chef! Here is your latest business snapshot.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="self-start sm:self-auto flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/40 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <MetricCard
                title="Total Earnings"
                value={`$${metrics.totalRevenue.toFixed(2)}`}
                subtitle="vs last month"
                trend="+18.4%"
                trendPositive={true}
                icon={DollarSign}
                accentColor="#FF385C"
              />
              <MetricCard
                title="Total Orders"
                value={metrics.totalOrdersCount}
                subtitle="Lifetime orders"
                trend="+12%"
                trendPositive={true}
                icon={ShoppingBag}
                accentColor="#FFB703"
              />
              <MetricCard
                title="Active Orders"
                value={metrics.activeOrdersCount}
                subtitle="Needs fulfillment"
                icon={Clock}
                accentColor="#3B82F6"
              />
              <MetricCard
                title="Published Recipes"
                value={metrics.publishedRecipesCount}
                subtitle="Live in catalog"
                icon={BookOpen}
                accentColor="#10B981"
              />
            </div>

            {/* Revenue Analytics Chart */}
            <RevenueGraph data={revenueData} />

            {/* Two Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Live Kitchen Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[var(--accent-primary)] font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <OrderTracker
                  orders={orders.slice(0, 3)}
                  onStatusChange={handleStatusChange}
                  isLoading={isLoading}
                />
              </div>

              {/* Recipe Catalog Quick View */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Top Creations</h3>
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="text-xs text-[var(--accent-primary)] font-semibold hover:underline"
                  >
                    Manage Catalog
                  </button>
                </div>
                <RecipeManager
                  recipes={recipes}
                  onToggleOrderable={handleToggleOrderable}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <OrderTracker
              orders={orders}
              onStatusChange={handleStatusChange}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Recipes Tab Content */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <RecipeManager
              recipes={recipes}
              onToggleOrderable={handleToggleOrderable}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Payouts Tab Content */}
        {activeTab === 'payouts' && (
          <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-muted)]/30 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Razorpay Settlement & Payouts</h3>
                <p className="text-xs text-[var(--text-body)]">Automated daily transfers directly into your connected bank account</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                Direct Payouts Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-gray-400">Available Balance</div>
                <div className="text-2xl font-extrabold text-white mt-1">$482.00</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-gray-400">Pending Settlement</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">$185.50</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-gray-400">Lifetime Settled</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">$1,420.50</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
