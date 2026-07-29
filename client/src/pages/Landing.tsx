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
      <section className="relative py-28 px-6 bg-gradient-to-b from-bg-primary via-bg-surface/30 to-bg-primary border-y border-border-muted/40 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 w-fit mx-auto">
              <Sparkles className="w-4 h-4 text-accent-secondary animate-pulse" />
              <span className="text-xs font-semibold text-accent-secondary uppercase tracking-widest">
                Built For Modern Food Culture
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Designed for Creators & Food Enthusiasts
            </h2>
            <p className="text-text-body text-base sm:text-lg leading-relaxed">
              Whether you want to build a loyal following with your secret artisanal recipes or turn your culinary passion into a thriving business, TasteCraft powers your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative rounded-3xl p-px bg-gradient-to-b from-border-muted/80 via-accent-primary/20 to-border-muted/30 hover:from-accent-primary/60 hover:via-accent-primary/40 hover:to-accent-primary/10 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-accent-primary/10">
              <div className="h-full bg-bg-surface/90 backdrop-blur-xl rounded-[23px] p-8 flex flex-col justify-between gap-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent-primary/10 rounded-full blur-2xl group-hover:bg-accent-primary/25 transition-all duration-500" />
                
                <div className="flex flex-col gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 border border-accent-primary/30 flex items-center justify-center text-accent-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-primary/20 transition-all duration-300">
                    <Utensils className="w-7 h-7" />
                  </div>
                  
                  <div>
                    <div className="text-xs font-mono font-semibold text-accent-primary uppercase tracking-wider mb-1">
                      01 / Social Engine
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-accent-primary transition-colors">
                      Social Recipe Sharing
                    </h3>
                  </div>

                  <p className="text-sm text-text-body leading-relaxed">
                    Publish high-res step-by-step culinary guides with rich media, interactive ingredient scaling, and dietary tags to cultivate your personal brand.
                  </p>
                </div>

                <div className="pt-4 border-t border-border-muted/40 flex items-center justify-between text-xs font-semibold text-accent-primary group-hover:translate-x-1 transition-transform">
                  <span>Explore Creator Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-3xl p-px bg-gradient-to-b from-border-muted/80 via-accent-secondary/20 to-border-muted/30 hover:from-accent-secondary/60 hover:via-accent-secondary/40 hover:to-accent-secondary/10 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-accent-secondary/10">
              <div className="h-full bg-bg-surface/90 backdrop-blur-xl rounded-[23px] p-8 flex flex-col justify-between gap-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent-secondary/10 rounded-full blur-2xl group-hover:bg-accent-secondary/25 transition-all duration-500" />
                
                <div className="flex flex-col gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/5 border border-accent-secondary/30 flex items-center justify-center text-accent-secondary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-secondary/20 transition-all duration-300">
                    <Sparkles className="w-7 h-7" />
                  </div>

                  <div>
                    <div className="text-xs font-mono font-semibold text-accent-secondary uppercase tracking-wider mb-1">
                      02 / AI Intelligence
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-accent-secondary transition-colors">
                      AI Recipe Assistant
                    </h3>
                  </div>

                  <p className="text-sm text-text-body leading-relaxed">
                    Input leftover pantry ingredients or a flavor profile. Our specialized AI crafts complete structured recipes ready for instant cooking or publishing.
                  </p>
                </div>

                <div className="pt-4 border-t border-border-muted/40 flex items-center justify-between text-xs font-semibold text-accent-secondary group-hover:translate-x-1 transition-transform">
                  <span>Try AI Generator</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-3xl p-px bg-gradient-to-b from-border-muted/80 via-accent-primary-2/20 to-border-muted/30 hover:from-accent-primary-2/60 hover:via-accent-primary-2/40 hover:to-accent-primary-2/10 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-accent-primary-2/10">
              <div className="h-full bg-bg-surface/90 backdrop-blur-xl rounded-[23px] p-8 flex flex-col justify-between gap-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent-primary-2/10 rounded-full blur-2xl group-hover:bg-accent-primary-2/25 transition-all duration-500" />
                
                <div className="flex flex-col gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary-2/20 to-accent-primary-2/5 border border-accent-primary-2/30 flex items-center justify-center text-accent-primary-2 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-primary-2/20 transition-all duration-300">
                    <ShoppingBag className="w-7 h-7" />
                  </div>

                  <div>
                    <div className="text-xs font-mono font-semibold text-accent-primary-2 uppercase tracking-wider mb-1">
                      03 / Monetization
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-accent-primary-2 transition-colors">
                      Turn Recipes into Revenue
                    </h3>
                  </div>

                  <p className="text-sm text-text-body leading-relaxed">
                    Set dish prices, meal kit tiers, and custom add-ons. Fulfill local dish orders seamlessly with automated checkout and live earnings analytics.
                  </p>
                </div>

                <div className="pt-4 border-t border-border-muted/40 flex items-center justify-between text-xs font-semibold text-accent-primary-2 group-hover:translate-x-1 transition-transform">
                  <span>Start Selling Dishes</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modernized CTA Footer */}
      <footer className="relative pt-20 pb-12 px-6 bg-bg-primary border-t border-border-muted/60 overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-gradient-to-b from-accent-primary/10 to-transparent blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
          {/* Main CTA Card */}
          <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-accent-primary/15 via-bg-surface to-accent-secondary/10 border border-accent-primary/30 shadow-2xl overflow-hidden text-center flex flex-col items-center gap-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
            <div className="w-12 h-12 rounded-2xl bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center text-accent-primary">
              <Utensils className="w-6 h-6 animate-bounce" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl leading-tight">
              Ready to Craft Your First Culinary Masterpiece?
            </h2>
            <p className="text-text-body max-w-xl text-base sm:text-lg">
              Join thousands of food lovers, home chefs, and gourmet creators today on TasteCraft.
            </p>
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <Button variant="primary" size="lg" className="shadow-2xl shadow-accent-primary/30 hover:scale-105 transition-transform duration-300">
                  Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignUpButton>
            )}
          </div>

          {/* Footer Grid Links & Brand info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-6 border-t border-border-muted/40 text-left text-sm text-text-body">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-primary-2 flex items-center justify-center shadow-md">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">TasteCraft</span>
              </div>
              <p className="text-xs text-text-body/80 leading-relaxed">
                The premier social ecosystem connecting home gourmet chefs with food passionates worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">Platform</h4>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li className="hover:text-accent-primary cursor-pointer transition-colors" onClick={() => navigate('/explore')}>Community Feed</li>
                <li className="hover:text-accent-primary cursor-pointer transition-colors" onClick={() => navigate('/explore')}>AI Chef Assistant</li>
                <li className="hover:text-accent-primary cursor-pointer transition-colors" onClick={() => navigate('/explore')}>Trending Dishes</li>
                <li className="hover:text-accent-primary cursor-pointer transition-colors" onClick={() => navigate('/explore')}>Creator Kitchens</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">Creators</h4>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li className="hover:text-accent-secondary cursor-pointer transition-colors">Monetization Guide</li>
                <li className="hover:text-accent-secondary cursor-pointer transition-colors">Recipe Guidelines</li>
                <li className="hover:text-accent-secondary cursor-pointer transition-colors">Partner Program</li>
                <li className="hover:text-accent-secondary cursor-pointer transition-colors">Kitchen Dashboard</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4">Tech & Trust</h4>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li className="hover:text-text-heading cursor-pointer transition-colors">Razorpay Secure Pay</li>
                <li className="hover:text-text-heading cursor-pointer transition-colors">Clerk Authentication</li>
                <li className="hover:text-text-heading cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-text-heading cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-muted/30 text-xs text-text-body/60">
            <p>© 2026 TasteCraft Platform. Built with React, TypeScript & Dark Culinary Styling.</p>
            <div className="flex gap-4 font-mono text-[11px]">
              <span className="hover:text-white cursor-pointer">v2.4.0</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Status: All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
