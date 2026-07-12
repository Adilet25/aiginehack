import type { HeritageLocation } from "../../types";
import { useLang } from "../../app/providers/LanguageProvider";

interface LocationSidePanelProps {
  location: HeritageLocation | null;
  nearbyWarning?: string | null;
}

export default function LocationSidePanel({
  location,
  nearbyWarning,
}: LocationSidePanelProps) {
  const { t } = useLang();

  if (!location) {
    return (
      <div className="glow-card panel-ornament rounded-3xl p-6">
        <h3 className="text-lg font-bold">{t.selectedPlace}</h3>
        <p className="mt-2 text-sm text-muted">{t.noPlace}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {nearbyWarning && (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {nearbyWarning}
        </div>
      )}

      <div className="glow-card panel-ornament rounded-3xl p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black">{location.name}</h3>
            <p className="mt-1 text-sm text-muted">{location.district}</p>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
              location.kind === "sacred" ? "kind-sacred" : "kind-petro"
            }`}
          >
            {location.kind}
          </span>
        </div>

        <p className="text-sm leading-7 text-muted">{location.description}</p>

        {location.culturalNote && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wide text-stone-900 dark:text-white/40">
              Cultural note
            </p>
            <p className="mt-2 text-sm text-stone-900 dark:text-white/80">
              {location.culturalNote}
            </p>
          </div>
        )}

        {location.analysisSummary && (
          <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
            <p className="text-xs uppercase tracking-wide text-blue-100/60">
              Analysis
            </p>
            <p className="mt-2 text-sm text-blue-50">
              {location.analysisSummary}
            </p>
          </div>
        )}

        {!!location.rules?.length && (
          <div className="mt-4">
            <h4 className="text-base font-bold">{t.sacredRules}</h4>
            <div className="mt-3 space-y-2">
              {location.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-2xl border border-red-400/15 bg-red-500/8 px-4 py-3 text-sm text-red-50"
                >
                  {rule.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {location.sourceLabel && (
          <p className="mt-5 text-xs uppercase tracking-widest text-stone-900 dark:text-white/35">
            Source: {location.sourceLabel}
          </p>
        )}
      </div>
    </div>
  );
}
