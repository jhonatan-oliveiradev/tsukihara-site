export type RememberAnalyticsEvent =
  "remember_started" | "remember_restore_completed" | "remember_replay_started";

export function trackRememberEvent(
  _event: RememberAnalyticsEvent,
  _payload?: Record<string, unknown>,
): void {
  // Intentionally no-op until the host site adopts an analytics provider.
}
