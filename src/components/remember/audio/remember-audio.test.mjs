import assert from "node:assert/strict";
import test from "node:test";

async function loadAudio() {
  return import("./remember-audio.ts");
}

test("restoration duck drops the phase score to roughly twelve percent of its gameplay level", async () => {
  const { getRestorationDuckVolume, rememberAudioTracks } = await loadAudio();
  assert.equal(typeof getRestorationDuckVolume, "function");

  const base = rememberAudioTracks.phase.volume;
  const ducked = getRestorationDuckVolume(base);

  assert.ok(ducked > 0);
  assert.ok(ducked <= base * 0.13);
  assert.ok(ducked >= base * 0.11);
});
