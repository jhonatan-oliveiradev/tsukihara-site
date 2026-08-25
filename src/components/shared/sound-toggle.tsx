type SoundToggleProps = {
  muted: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
};

export function SoundToggle({
  muted,
  label,
  onToggle,
  className,
  showLabel = true,
}: SoundToggleProps) {
  return (
    <button
      type="button"
      className={["shared-sound-toggle", className].filter(Boolean).join(" ")}
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={label}
      title={label}
    >
      <span className="shared-sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {showLabel && <span>{label}</span>}
    </button>
  );
}
