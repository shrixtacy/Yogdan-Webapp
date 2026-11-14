// Staged donor proximity matching logic
export const MATCH_STAGES = [
  { min: 0,  max: 5,        label: '0–5 km' },
  { min: 5,  max: 10,       label: '5–10 km' },
  { min: 10, max: 15,       label: '10–15 km' },
  { min: 15, max: 20,       label: '15–20 km' },
  { min: 20, max: Infinity, label: 'Extended reach' },
];

const NOTIFY_COOLDOWN_MS = 24 * 3600_000;

const inCooldown = (donor, now) =>
  donor.lastNotifiedAt && now.getTime() - new Date(donor.lastNotifiedAt).getTime() < NOTIFY_COOLDOWN_MS;

export const donorsForStage = (request, donors, stageIndex, now) => {
  const stage = MATCH_STAGES[stageIndex];
  if (!stage || request.bloodGroup === 'Unknown') return [];
  return donors.filter(
    (d) =>
      d.consent && d.available &&
      d.bloodGroup === request.bloodGroup &&
      d.distanceKm >= stage.min && d.distanceKm < stage.max &&
      !request.notifiedDonorIds.includes(d.id) &&
      !inCooldown(d, now),
  );
};

export const advanceMatching = (request, donors, now) => {
  const next = request.matchStage + 1;
  if (next >= MATCH_STAGES.length) return null;
  return { stageIndex: next, notified: donorsForStage(request, donors, next, now).map((d) => d.id) };
};

export const distanceBand = (km) =>
  (MATCH_STAGES.find((s) => km >= s.min && km < s.max) ?? MATCH_STAGES[4]).label;
