type MemoryDecayTextProps = {
  text: string;
  active: boolean;
};

export function MemoryDecayText({ text, active }: MemoryDecayTextProps) {
  return (
    <span className="ix-archive-decay" data-memory-decay={active ? "active" : undefined}>
      <span className="ix-archive-visually-hidden">{text}</span>
      <span aria-hidden="true" className="ix-archive-decay__visual">
        {text.split(/(\s+)/).map((token, index) => (
          <span
            key={`${token}-${index}`}
            data-decay-word={index % 5 === 2 && token.trim() ? "true" : undefined}
          >
            {token}
          </span>
        ))}
      </span>
    </span>
  );
}
