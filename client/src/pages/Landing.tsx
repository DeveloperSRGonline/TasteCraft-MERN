import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ArrowRight, Flame, Star, ShoppingBag, Sparkles, Utensils } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { SignInButton, SignUpButton, useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-heading selection:bg-accent-primary selection:text-white">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-bg-primary/70 border-b border-border-muted px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent-primary to-accent-primary-2 flex items-center justify-center shadow-lg shadow-accent-primary/20">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-linear-to-r from-white via-text-heading to-accent-secondary bg-clip-text text-transparent tracking-tight">
                TasteCraft
              </span>
              <span className="text-[10px] block text-accent-secondary font-mono tracking-widest uppercase -mt-1">
                Gourmet Social
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Button variant="primary" onClick={() => navigate('/explore')}>
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="primary" size="sm">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/30 w-fit">
              <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
              <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">
                Where Culinary Art Meets Community
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Share Gourmet Recipes.{' '}
              <span className="bg-linear-to-r from-accent-primary via-accent-primary-2 to-accent-secondary bg-clip-text text-transparent">
                Order Real Dishes.
              </span>
            </h1>

            <p className="text-lg text-text-body max-w-2xl leading-relaxed">
              Discover artisanal recipes created by passionate home chefs, generate instant culinary ideas with AI, and order fresh gourmet meal kits straight from your favorite creators.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isSignedIn ? (
                <Button variant="primary" size="lg" onClick={() => navigate('/explore')}>
                  Explore Community Feed <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button variant="primary" size="lg">
                    Join TasteCraft Free <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignUpButton>
              )}
              <Button variant="outline" size="lg" onClick={() => {
                document.getElementById('recipe-of-the-day')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Recipe of the Day
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border-muted/50 mt-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">10K+</div>
                <div className="text-xs text-text-body mt-0.5">Gourmet Recipes</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">2.5K+</div>
                <div className="text-xs text-text-body mt-0.5">Creator Kitchens</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">99%</div>
                <div className="text-xs text-text-body mt-0.5">Satisfaction Rating</div>
              </div>
            </div>
          </div>

          {/* Recipe of the Day Spotlight Card */}
          <div id="recipe-of-the-day" className="lg:col-span-5 z-10">
            <Card className="p-6 relative overflow-hidden group border border-accent-secondary/30 bg-bg-surface/80 backdrop-blur-md shadow-2xl hover:border-accent-secondary/60 transition-all duration-300">
              <div className="absolute top-4 right-4 z-20">
                <Badge variant="amber" className="flex items-center gap-1 font-bold text-xs py-1 px-3 shadow-lg">
                  <Flame className="w-3.5 h-3.5 fill-accent-secondary" /> RECIPE OF THE DAY
                </Badge>
              </div>

              {/* Recipe Image preview */}
              <div className="h-64 -mx-6 -mt-6 mb-6 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
                  alt="Truffle Mushroom Risotto" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-bg-surface via-bg-surface/20 to-transparent" />
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <Badge variant="primary">Italian Gourmet</Badge>
                  <Badge variant="amber">30 Mins Prep</Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-text-body mb-2">
                  <span className="flex items-center gap-1 text-accent-secondary font-medium">
                    <Star className="w-4 h-4 fill-accent-secondary" /> 4.98 (342 reviews)
                  </span>
                  <span className="flex items-center gap-1 font-mono text-accent-primary">
                    <Flame className="w-3.5 h-3.5" /> High Velocity
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-accent-secondary transition-colors">
                  Wild Truffle & Mushroom Risotto
                </h3>
                <p className="text-sm text-text-body mt-2 line-clamp-2">
                  Hand-crafted Arborio rice infused with black winter truffle oil, wild forest mushrooms, and aged Parmigiano-Reggiano.
                </p>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-muted/60">
                  <div>
                    <span className="text-xs text-text-body block">Creator Dish Price</span>
                    <span className="text-xl font-extrabold text-accent-primary">$22.50</span>
                  </div>
                  {isSignedIn ? (
                    <Button variant="primary" size="sm" onClick={() => navigate('/explore')}>
                      <ShoppingBag className="w-4 h-4 mr-1.5" /> Order Meal Kit
                    </Button>
                  ) : (
                    <SignUpButton mode="modal">
                      <Button variant="primary" size="sm">
                        <ShoppingBag className="w-4 h-4 mr-1.5" /> Order Now
                      </Button>
                    </SignUpButton>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights & Parallax Showcase */}
      <section className="py-20 px-6 bg-bg-surface/40 border-y border-border-muted/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Designed for Creators & Food Enthusiasts
            </h2>
            <p className="text-text-body text-base">
              Whether you want to build a following with your secret family recipes or turn your culinary talent into a profitable business, TasteCraft gives you the tools to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 flex flex-col gap-4 hover:translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Social Recipe Sharing</h3>
              <p className="text-sm text-text-body leading-relaxed">
                Post detailed step-by-step recipes with rich media, ingredient breakdowns, and portion controls. Build your personal brand.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 flex flex-col gap-4 hover:translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Recipe Assistant</h3>
              <p className="text-sm text-text-body leading-relaxed">
                Input any theme, craving, or leftover ingredients. Our AI generates complete structured recipes ready for you to review and publish.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 flex flex-col gap-4 hover:translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-accent-primary-2/10 border border-accent-primary-2/20 flex items-center justify-center text-accent-primary-2">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Turn Recipes into Revenue</h3>
              <p className="text-sm text-text-body leading-relaxed">
                Set custom prices, portion tiers, and custom add-ons. Receive orders with automated Razorpay checkout and track earnings in real-time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 px-6 bg-bg-primary border-t border-border-muted text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl font-extrabold text-white">Ready to Craft Your First Culinary Masterpiece?</h2>
          <p className="text-text-body max-w-xl">
            Join thousands of food lovers, home chefs, and gourmet creators today on TasteCraft.
          </p>
          {!isSignedIn && (
            <SignUpButton mode="modal">
              <Button variant="primary" size="lg" className="shadow-xl shadow-accent-primary/20">
                Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignUpButton>
          )}
          <p className="text-xs text-text-body/60 mt-8">
            © 2026 TasteCraft Platform. Built with React, TypeScript & Dark Culinary Styling.
          </p>
        </div>
      </footer>
    </div>
  );
}
