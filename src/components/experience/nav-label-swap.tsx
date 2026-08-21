type NavLabelSwapProps = {
  primary: string;
  secondary: string;
};

export function NavLabelSwap({ primary, secondary }: NavLabelSwapProps) {
  return (
    <span className="ix-nav-swap" aria-label={primary}>
      <span className="ix-nav-swap-track" aria-hidden="true">
        <span>{primary}</span>
        <span lang="ja">{secondary}</span>
      </span>
    </span>
  );
}
