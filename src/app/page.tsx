import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Zap, Shield, DollarSign, LineChart, Clock, Check, Utensils, ChefHat, Sandwich } from 'lucide-react'

export default function HomePage() {
  const featureHighlights = [
    {
      title: 'Menu-ready paywalls',
      description: 'Spin up a polished landing page where food lovers can unlock your hottest tables, street eats, or tasting menus.',
      icon: Utensils,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
    },
    {
      title: 'Keep it exclusive',
      description: 'Send buyers to a private dining room experience with hosted mirrors, printable hit lists, and instant Google Maps follow links.',
      icon: Shield,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Track every reservation',
      description: 'Measure sales, average order value, and retention so you know which neighbourhood guide deserves the next deep dive.',
      icon: LineChart,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-500',
    },
  ]

  const steps = [
    {
      title: 'Import your map',
      description: 'Paste a Google Maps list and Delish brings in every bookmarked trattoria, wine bar, and dessert counter.',
      icon: MapPin,
    },
    {
      title: 'Season your offer',
      description: 'Write irresistible menu copy, pick a price, and add secret tips, chef notes, or pairing suggestions.',
      icon: ChefHat,
    },
    {
      title: 'Serve the city',
      description: 'Drop unlock links on Instagram, Substack, or email and watch Stripe deliver payouts for every new foodie fan.',
      icon: DollarSign,
    },
  ]

  const stats = [
    { value: '2 min', label: 'From map to paid tasting tour' },
    { value: '$48k', label: 'Payouts sent to food creators' },
    { value: '18k+', label: 'Dining itineraries unlocked' },
  ]

  const useCases = [
    { emoji: '🍜', title: 'Street food scouts', blurb: 'Map late-night noodle bars and hawker stalls before the crowds arrive.' },
    { emoji: '🍷', title: 'Sommelier guides', blurb: 'Curate wine bar crawls with tasting notes and pairing cheat sheets.' },
    { emoji: '🍩', title: 'Dessert fanatics', blurb: 'Sell seasonal pastry crawls and limited-run bakery drops to superfans.' },
    { emoji: '🍹', title: 'Cocktail whisperers', blurb: 'Unlock speakeasy lineups, signature recipes, and bartender introductions.' },
  ]

  return (
    <div className="bg-white text-gray-900">
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900 text-white">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu blur-3xl">
          <div className="mx-auto h-[28rem] w-full max-w-5xl bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-sky-400/20 opacity-70" />
        </div>

        <div className="container mx-auto px-4 pb-24 pt-16 md:pt-20">
          <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
              <MapPin className="h-6 w-6 text-blue-200" />
              <span>Delish</span>
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4 md:justify-end">
              <div className="flex items-center gap-6 text-sm text-blue-100 md:mr-6">
                <a href="#features" className="transition hover:text-white">Product</a>
                <a href="#how-it-works" className="transition hover:text-white">How it works</a>
                <a href="#use-cases" className="transition hover:text-white">Who it is for</a>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/sign-in" className="text-sm font-medium text-blue-100 transition hover:text-white">
                  Sign in
                </Link>
                <Button asChild size="sm" className="bg-white text-blue-900 hover:bg-blue-100">
                  <Link href="/sign-up">Get started free</Link>
                </Button>
              </div>
            </div>
          </nav>

          <div className="grid gap-12 pt-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
            <div>
              <Badge variant="secondary" className="mb-6 border border-white/20 bg-white/10 text-white backdrop-blur">
                Beta invitations now open
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                Launch premium Google Maps guides in minutes
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-blue-100 md:text-xl">
                Delish helps curators package local knowledge into beautiful paid experiences. We handle secure checkouts,
                instant delivery, and ongoing updates so you can focus on discovering the next great spot.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-8 text-lg shadow-lg shadow-rose-500/30">
                  <Link href="/sign-up">Launch your food guide</Link>
                </Button>
              </div>
              <ul className="mt-8 grid gap-3 text-sm text-blue-100 sm:grid-cols-2">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  No-code flow built for tastemakers and tour hosts
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  Automatic buyer emails with chef notes and unlock portals
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  Stripe Connect payouts routed the moment sales happen
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  Built-in analytics to track revenue and repeat diners
                </li>
              </ul>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-white/20 bg-white/10 text-white shadow-2xl shadow-blue-900/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Your first tasting tour</CardTitle>
                <CardDescription className="text-blue-100">
                  Launch a digital dining room that delivers your favourite spots the moment guests check out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-100">Signature map</span>
                      <span className="text-sm text-white">Brooklyn Bites Crawl</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-blue-100">Ticket price</span>
                      <span className="text-lg font-semibold text-white">$24.00</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-100">Average unlocks</span>
                      <span className="text-sm text-white">146 diners / month</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-blue-100">Five-star reviews</span>
                      <span className="text-lg font-semibold text-white">92%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-blue-100">
                  <p>• Guests receive a gorgeously branded unlock email within seconds.</p>
                  <p>• Add chef notes, pairing tips, or printable menu cards for premium buyers.</p>
                  <p>• Real-time sales notifications keep you in the loop for every reservation.</p>
                </div>
                <Button asChild variant="secondary" className="w-full bg-white text-blue-900 hover:bg-blue-100">
                  <Link href="/dashboard">Preview the dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">Built for food storytellers</Badge>
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            Everything you need to package crave-worthy recommendations
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From checkout to delivery, Delish keeps your restaurant intel exclusive while diners enjoy a guided experience that feels like a seat at your table.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featureHighlights.map(({ title, description, icon: Icon, iconBg, iconColor }) => (
            <Card key={title} className="h-full border-gray-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
                <CardDescription className="text-base text-gray-600">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">Service flow</Badge>
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Go from saved spots to paid tours tonight</h2>
            <p className="mt-4 text-lg text-gray-600">
              No engineering needed—just your palate, your Google Maps list, and a hungry audience ready for their next reservation.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <Card key={title} className="h-full border-gray-100 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="inline-flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white">
                      {index + 1}
                    </span>
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
                  <CardDescription className="text-base text-gray-600">{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">For culinary curators</Badge>
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Designed for the voices shaping every city&apos;s dining scene</h2>
          <p className="mt-4 text-lg text-gray-600">
            Whether you host supper clubs, write a tasting newsletter, or guide friends through hidden gems, Delish turns your expertise into premium insider access.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
              <div className="mb-4 text-3xl">{useCase.emoji}</div>
              <h3 className="text-xl font-semibold text-gray-900">{useCase.title}</h3>
              <p className="mt-3 text-base text-gray-600">{useCase.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-blue-600 py-20 text-white">
        <div className="absolute inset-y-0 right-0 -z-10 h-full w-1/2 translate-x-1/3 rounded-full bg-blue-500/40 blur-3xl" />
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Ready to start earning from your maps?</h2>
          <p className="mt-4 text-lg text-blue-100 sm:text-xl">
            Join creators turning local knowledge into sustainable revenue with automated checkouts and delighted buyers.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-lg text-blue-900">
              <Link href="/sign-up">Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 border border-white/50 px-8 text-lg text-white hover:bg-white/10">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 text-center text-sm text-gray-400 md:flex-row md:text-left">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span className="text-base font-semibold">Delish</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/sign-up" className="transition hover:text-white">Create guide</Link>
              <Link href="/dashboard" className="transition hover:text-white">Dashboard</Link>
              <a href="mailto:hello@delish.app" className="transition hover:text-white">Contact</a>
            </div>
            <p>© 2024 Delish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
