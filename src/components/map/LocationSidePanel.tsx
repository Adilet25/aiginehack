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
        <div className="rounded-2xl border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
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
            {location.kind === "sacred" ? t.kindSacred : t.kindPetroglyph}
          </span>
        </div>

        <p className="text-sm leading-7 text-muted">{location.description}</p>

        {location.culturalNote && (
          <div className="mt-4 rounded-2xl border border-line  bg-wash  p-4">
            <p className="text-xs uppercase tracking-wide text-ink  ">
              {t.culturalNote}
            </p>
            <p className="mt-2 text-sm text-ink  ">
              {location.culturalNote}
            </p>
          </div>
        )}

        {location.analysisSummary && (
          <div className="mt-4 rounded-2xl border border-sky bg-sky-soft p-4">
            <p className="text-xs uppercase tracking-wide text-sky">
              {t.analysis}
            </p>
            <p className="mt-2 text-sm text-sky">
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
                  className="rounded-2xl border border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
                >
                  {rule.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {location.sourceLabel && (
          <p className="mt-5 text-xs uppercase tracking-widest text-ink ">
            {t.source}: {location.sourceLabel}
          </p>
        )}
      </div>
    </div>
  );
}
