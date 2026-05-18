import { ordering } from "@/lib/content";

export function OrderingSteps() {
  return (
    <div>
      <p className="max-w-2xl text-stone leading-relaxed">{ordering.intro}</p>
      <ol className="mt-10 grid gap-8 md:grid-cols-3">
        {ordering.steps.map((step, index) => (
          <li key={step.title} className="border-t border-parchment pt-6">
            <span className="text-xs font-medium tracking-[0.2em] text-sage">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-serif text-xl text-bark">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm text-stone">{ordering.pickupNote}</p>
    </div>
  );
}
