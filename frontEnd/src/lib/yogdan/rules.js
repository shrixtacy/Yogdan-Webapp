// Business rules for assessments, donations and leaderboard rankings
export const ASSESSMENT_INTERVAL_DAYS = 7;
const DAY_MS = 86_400_000;

export const latestAssessment = (list) =>
  [...list].sort((a, b) => b.date.localeCompare(a.date))[0];

export const nextAssessmentDate = (list) => {
  const last = latestAssessment(list);
  return last ? new Date(new Date(last.date).getTime() + ASSESSMENT_INTERVAL_DAYS * DAY_MS) : null;
};

export const isAssessmentDue = (list, now) => {
  const next = nextAssessmentDate(list);
  return next === null || now.getTime() >= next.getTime();
};

export const weekKey = (d) => {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (x.getUTCDay() + 6) % 7;
  x.setUTCDate(x.getUTCDate() - day);
  return x.toISOString().slice(0, 10);
};

export const shouldShowReminder = (list, reminder, enabled, now) => {
  if (!enabled || !isAssessmentDue(list, now)) return false;
  if (reminder.snoozedUntil && now < new Date(reminder.snoozedUntil)) return false;
  if (reminder.skippedWeekOf && reminder.skippedWeekOf === weekKey(now)) return false;
  return true;
};

export const verifiedDonationCount = (donations, since) =>
  donations.filter((d) => d.status === 'verified' && (!since || new Date(d.date) >= since)).length;

export const DONATION_MILESTONES = [1, 3, 5, 10, 25];

export const rankBoard = (entries, board) => {
  const key = board === 'month' ? 'verifiedMonth' : 'verifiedAll';
  return entries
    .filter((e) => e.publicRanking && e[key] > 0)
    .sort((a, b) => b[key] - a[key] || a.name.localeCompare(b.name));
};
