"use client";

import { useEffect, useMemo, useState } from "react";

const reactionOptions = [
  { value: "sharp", label: "Sharp", emoji: "✍️" },
  { value: "useful", label: "Useful", emoji: "👍" },
  { value: "more", label: "More like this", emoji: "➕" },
] as const;

type ReactionValue = (typeof reactionOptions)[number]["value"];

export function ReactionWidget({ storageKey, title = "How did this land?" }: { storageKey: string; title?: string }) {
  const key = useMemo(() => `totalbarca:reaction:${storageKey}`, [storageKey]);
  const [selected, setSelected] = useState<ReactionValue | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(key) as ReactionValue | null;
    if (storedValue && reactionOptions.some((option) => option.value === storedValue)) {
      setSelected(storedValue);
    }
    setIsLoaded(true);
  }, [key]);

  function handleReactionSelect(value: ReactionValue) {
    window.localStorage.setItem(key, value);
    setSelected(value);
  }

  return (
    <section className="reaction-widget" aria-label={title}>
      <div>
        <h2>{title}</h2>
        <p>Quick local feedback for this device. No sign-in, no modal, no fuss.</p>
      </div>
      <div className="reaction-widget__buttons" role="group" aria-label={title}>
        {reactionOptions.map((option) => (
          <button
            key={option.value}
            aria-pressed={selected === option.value}
            className="reaction-widget__button"
            data-selected={selected === option.value ? "true" : undefined}
            onClick={() => handleReactionSelect(option.value)}
            type="button"
          >
            <span aria-hidden="true">{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      {isLoaded && selected ? <p className="reaction-widget__status">Saved on this device.</p> : null}
    </section>
  );
}
