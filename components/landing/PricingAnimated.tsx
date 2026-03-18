"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import confetti from "canvas-confetti";

interface Plan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  isPopular: boolean;
  isFree?: boolean;
}

const plans: Plan[] = [
  {
    name: "Gratuit",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Pour tester sans engagement",
    features: [
      "5 factures par mois",
      "Dictée vocale",
      "PDF conforme",
      "1 utilisateur",
    ],
    cta: "Commencer gratuitement",
    href: "/register",
    isPopular: false,
    isFree: true,
  },
  {
    name: "Solo",
    monthlyPrice: 9.99,
    yearlyPrice: 7.99,
    description: "Pour les freelances actifs",
    features: [
      "Factures illimitées",
      "Dictée vocale illimitée",
      "Relances automatiques",
      "Export comptable CSV",
      "Support prioritaire",
    ],
    cta: "Démarrer Solo",
    href: "/checkout?plan=solo&interval=monthly",
    isPopular: true,
  },
  {
    name: "Pro",
    monthlyPrice: 19.99,
    yearlyPrice: 15.99,
    description: "Pour les indépendants en croissance",
    features: [
      "Tout Solo inclus",
      "Devis + avoirs",
      "Multi-utilisateurs (3)",
      "Factur-X (EDI)",
      "Intégration Stripe",
      "API accès",
    ],
    cta: "Démarrer Pro",
    href: "/checkout?plan=pro&interval=monthly",
    isPopular: false,
  },
];

export default function PricingAnimated() {
  const [isAnnual, setIsAnnual] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsAnnual(checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#1D9E75", "#0D0D0D", "#6EE7B7"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-[#0D0D0D] tracking-[-0.02em] mb-4">
            Tarifs simples.
          </h2>
          <p className="text-gray-500 text-lg">Sans surprise. Résiliable en 1 clic.</p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <Label htmlFor="billing-toggle" className="text-sm font-medium text-gray-600">
              Mensuel
            </Label>
            <Switch
              id="billing-toggle"
              ref={switchRef as any}
              checked={isAnnual}
              onCheckedChange={handleToggle}
            />
            <Label htmlFor="billing-toggle" className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
              Annuel
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                −20%
              </span>
            </Label>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ y: 40, opacity: 0 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.isPopular ? -12 : 0,
                      opacity: 1,
                      scale: plan.isPopular ? 1 : 0.97,
                    }
                  : { y: 0, opacity: 1 }
              }
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative rounded-3xl border p-8 flex flex-col",
                plan.isPopular
                  ? "border-[#0D0D0D] border-2 bg-[#0D0D0D] text-white"
                  : "border-gray-200 bg-white"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap size={11} fill="white" /> Recommandé
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={cn("text-xs font-semibold uppercase tracking-widest mb-3", plan.isPopular ? "text-gray-400" : "text-gray-400")}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  {plan.isFree ? (
                    <span className={cn("text-5xl font-black tracking-tight", plan.isPopular ? "text-white" : "text-[#0D0D0D]")}>
                      0€
                    </span>
                  ) : (
                    <>
                      <span className={cn("text-5xl font-black tracking-tight", plan.isPopular ? "text-white" : "text-[#0D0D0D]")}>
                        <NumberFlow
                          value={isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                          format={{ style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                          transformTiming={{ duration: 400, easing: "ease-out" }}
                          willChange
                        />
                      </span>
                      <span className={cn("text-sm mb-2", plan.isPopular ? "text-gray-400" : "text-gray-400")}>/mois</span>
                    </>
                  )}
                </div>
                <p className={cn("text-xs", plan.isPopular ? "text-gray-500" : "text-gray-400")}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className={cn("mt-0.5 shrink-0", plan.isPopular ? "text-primary-400" : "text-primary-500")}
                    />
                    <span className={cn("text-sm", plan.isPopular ? "text-gray-300" : "text-gray-600")}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.isFree ? plan.href : `${plan.href.split('&')[0]}&interval=${isAnnual ? 'annual' : 'monthly'}`}
                className={cn(
                  "w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all",
                  plan.isPopular
                    ? "bg-primary-500 hover:bg-primary-400 text-white"
                    : "bg-[#0D0D0D] hover:bg-[#1a1a1a] text-white"
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
