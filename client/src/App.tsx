import { useState } from 'react';
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/react';
import { Button } from './components/ui/Button';
import { Chip } from './components/ui/Chip';
import { Card } from './components/ui/Card';
import { Drawer } from './components/ui/Drawer';
import { Modal } from './components/ui/Modal';
import { Input } from './components/ui/Input';
import { Badge } from './components/ui/Badge';
import { PillTab } from './components/ui/PillTab';
import { PortionSelector } from './components/ui/PortionSelector';
import { Search, Flame, Utensils, ShoppingBag, ShieldCheck, UserCheck } from 'lucide-react';

function App() {
  const { user } = useUser();
  const [activeCategory, setActiveCategory] = useState('main');
  const [selectedPortion, setSelectedPortion] = useState('medium');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'main', label: 'Main Dish', icon: <Utensils className="w-4 h-4" /> },
    { id: 'street', label: 'Street Food', icon: <Flame className="w-4 h-4" /> },
    { id: 'vegan', label: 'Vegan' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const portions = [
    { id: 'small', label: '380g', priceOffset: 0 },
    { id: 'medium', label: '480g', priceOffset: 50 },
    { id: 'large', label: '560g', priceOffset: 100 },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-heading p-8 flex flex-col items-center justify-start gap-8">
      {/* Header with Auth controls */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b border-border-muted pb-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            TasteCraft
          </h1>
          <p className="text-xs text-text-body mt-1">Phase 1: DB & Auth Sync Verification</p>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" size="sm">Sign Up</Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-body font-medium hidden sm:inline">
                {user?.fullName || user?.primaryEmailAddress?.emailAddress}
              </span>
              <UserButton />
            </div>
          </Show>
        </div>
      </header>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Auth status banner */}
        <Card className="p-6 border-l-4 border-l-accent-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-accent-secondary" />
              <h2 className="text-lg font-bold">Authentication & Mongo Sync Status</h2>
            </div>
            {user ? (
              <p className="text-sm text-text-body">
                Authenticated as <strong className="text-text-heading">{user?.primaryEmailAddress?.emailAddress}</strong> (Clerk ID: <code className="text-xs bg-bg-primary px-1.5 py-0.5 rounded border border-border-muted">{user?.id}</code>)
              </p>
            ) : (
              <p className="text-sm text-text-body">
                You are currently browsing as guest. Sign in or Sign up to test user session persistence and MongoDB profile sync.
              </p>
            )}
          </div>

          <div>
            {user ? (
              <Badge variant="amber" className="flex items-center gap-1.5 py-1 px-3">
                <UserCheck className="w-4 h-4" /> User Session Active
              </Badge>
            ) : (
              <Badge variant="primary" className="py-1 px-3">Guest Mode</Badge>
            )}
          </div>
        </Card>

        {/* Input & Search Section */}
        <section className="flex flex-col gap-3 bg-bg-surface p-6 rounded-2xl border border-border-muted">
          <h2 className="text-xl font-semibold">1. Input & Search Primitive</h2>
          <Input placeholder="Search recipes, ingredients..." icon={<Search className="w-4 h-4" />} />
        </section>

        {/* Pill Tab Primitive */}
        <section className="flex flex-col gap-3 bg-bg-surface p-6 rounded-2xl border border-border-muted">
          <h2 className="text-xl font-semibold">2. PillTab Category Switcher</h2>
          <PillTab tabs={categories} activeTab={activeCategory} onChange={setActiveCategory} />
        </section>

        {/* Portion Selector Primitive */}
        <section className="flex flex-col gap-3 bg-bg-surface p-6 rounded-2xl border border-border-muted">
          <h2 className="text-xl font-semibold">3. Portion Size Chip Selector</h2>
          <PortionSelector options={portions} selectedId={selectedPortion} onChange={setSelectedPortion} />
        </section>

        {/* Buttons & Badges */}
        <section className="flex flex-col gap-3 bg-bg-surface p-6 rounded-2xl border border-border-muted">
          <h2 className="text-xl font-semibold">4. Buttons, Chips & Badges</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary CTA</Button>
            <Button variant="secondary">Secondary CTA</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Chip label="Popular Recipe" active />
            <Badge variant="primary">Coral Red</Badge>
            <Badge variant="amber">Amber Rating</Badge>
          </div>
        </section>

        {/* Cards, Modal & Drawer Trigger */}
        <section className="flex flex-col gap-4 bg-bg-surface p-6 rounded-2xl border border-border-muted">
          <h2 className="text-xl font-semibold">5. Cards, Drawer & Modal Triggers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 flex flex-col justify-between h-48">
              <div>
                <Badge variant="amber" className="mb-2">Gourmet</Badge>
                <h3 className="text-lg font-bold">Truffle Tagliatelle</h3>
                <p className="text-xs text-text-body mt-1">Rich black truffle cream sauce with hand-cut egg pasta.</p>
              </div>
              <Button size="sm" onClick={() => setIsDrawerOpen(true)}>
                <ShoppingBag className="w-4 h-4 mr-2" /> Open Cart Drawer
              </Button>
            </Card>

            <Card className="p-5 flex flex-col justify-between h-48">
              <div>
                <Badge variant="primary" className="mb-2">Chef Special</Badge>
                <h3 className="text-lg font-bold">Smoked Wagyu Burger</h3>
                <p className="text-xs text-text-body mt-1">Aged cheddar, caramelized onions, truffle mayo.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
                View Recipe Modal
              </Button>
            </Card>
          </div>
        </section>
      </div>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Your Gourmet Cart">
        <div className="flex flex-col gap-4 text-text-body">
          <p className="text-sm">Cart drawer preview with smooth Framer Motion slide-in transition.</p>
          <div className="p-4 bg-bg-primary rounded-xl border border-border-muted flex justify-between items-center">
            <div>
              <p className="font-semibold text-text-heading">Truffle Tagliatelle</p>
              <p className="text-xs text-text-body">Portion: 480g</p>
            </div>
            <span className="font-bold text-accent-primary">$24.00</span>
          </div>
          <Button variant="primary" className="mt-4 w-full">Proceed to Checkout</Button>
        </div>
      </Drawer>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Smoked Wagyu Burger">
        <div className="flex flex-col gap-3 text-text-body text-sm">
          <p>A masterclass in burger creation. Slow-smoked Wagyu patty with artisanal cheeses and signature sauce.</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="amber">4.9 ★</Badge>
            <Badge variant="secondary">25 mins prep</Badge>
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={() => setIsModalOpen(false)}>Close Preview</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
