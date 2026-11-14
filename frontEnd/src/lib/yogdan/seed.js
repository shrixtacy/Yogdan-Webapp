// Sample/mock data for the Yogdan demo — no real users or donors here
const H = 3_600_000;
const D = 24 * H;

const GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GROUP_WEIGHTS = [22, 2, 32, 2, 8, 1, 30, 3];

function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export const SAMPLE_HOSPITALS = [
  { id: 'h1', name: 'Sanjeevani Multispeciality', area: 'Salt Lake Sector V', distanceKm: 2.4, bloodBank: true, open24h: true },
  { id: 'h2', name: 'Lifeline Medical Centre', area: 'Park Circus', distanceKm: 4.1, bloodBank: true, open24h: true },
  { id: 'h3', name: 'Arogya Hospital', area: 'New Town', distanceKm: 6.8, bloodBank: false, open24h: true },
  { id: 'h4', name: 'City Care Hospital', area: 'Ballygunge', distanceKm: 8.9, bloodBank: true, open24h: false },
  { id: 'h5', name: 'Seva Community Blood Bank', area: 'Dum Dum', distanceKm: 11.2, bloodBank: true, open24h: false },
];

function sampleRequests(now) {
  const base = { mine: false, relation: 'Family', contactName: 'Hidden until you respond', contactMobile: '', status: 'open', responses: [], matchStage: 0, notifiedDonorIds: [], stageCounts: [], sample: true };
  return [
    { ...base, id: 's1', patientName: 'Patient (R.K.)', patientAge: 54, bloodGroup: 'O+', units: 2, urgency: 'critical', requiredBy: new Date(now + 8 * H).toISOString(), hospital: 'Sanjeevani Multispeciality', hospitalArea: 'Salt Lake Sector V', locality: 'Salt Lake', distanceKm: 2.4, createdAt: new Date(now - 0.4 * H).toISOString(), notes: 'Scheduled surgery moved forward.' },
    { ...base, id: 's2', patientName: 'Patient (A.D.)', patientAge: 31, bloodGroup: 'B+', units: 1, urgency: 'urgent', requiredBy: new Date(now + 1.2 * D).toISOString(), hospital: 'Lifeline Medical Centre', hospitalArea: 'Park Circus', locality: 'Park Circus', distanceKm: 4.1, createdAt: new Date(now - 2 * H).toISOString() },
    { ...base, id: 's3', patientName: 'Patient (S.M.)', patientAge: 8, bloodGroup: 'A-', units: 1, urgency: 'urgent', requiredBy: new Date(now + 2 * D).toISOString(), hospital: "Nirmal Children's Hospital", hospitalArea: 'Behala', locality: 'Behala', distanceKm: 17.3, createdAt: new Date(now - 5 * H).toISOString() },
    { ...base, id: 's4', patientName: 'Patient (P.B.)', patientAge: 67, bloodGroup: 'AB+', units: 3, urgency: 'planned', requiredBy: new Date(now + 4 * D).toISOString(), hospital: 'City Care Hospital', hospitalArea: 'Ballygunge', locality: 'Ballygunge', distanceKm: 8.9, createdAt: new Date(now - 9 * H).toISOString() },
    { ...base, id: 's5', patientName: 'Patient (T.G.)', patientAge: 42, bloodGroup: 'O-', units: 2, urgency: 'critical', requiredBy: new Date(now + 6 * H).toISOString(), hospital: 'Riverside General Hospital', hospitalArea: 'Howrah', locality: 'Howrah', distanceKm: 14.6, createdAt: new Date(now - 1.1 * H).toISOString() },
  ];
}

function samplePosts(now) {
  return [
    { id: 'p1', authorId: 'u-ananya', authorName: 'Ananya Sen', authorHue: 12, kind: 'story', text: 'Donated for the 4th time at the Salt Lake camp today. If you\'ve been nervous about your first time, just go with a friend. ❤️', createdAt: new Date(now - 3 * H).toISOString(), likes: 48, likedByMe: false, comments: [], sample: true },
    { id: 'p2', authorId: 'u-yogdan', authorName: 'Yogdan Team', authorHue: 355, kind: 'announcement', text: 'We\'re partnering with local blood banks to make donation verification faster. Verified donations are the only ones that count towards the leaderboard.', createdAt: new Date(now - 26 * H).toISOString(), likes: 112, likedByMe: false, comments: [], sample: true },
  ];
}

function sampleLeaders() {
  const r = rng(7);
  const names = ['Ananya Sen', 'Rohit Das', 'Farah Khan', 'Vikram Roy', 'Meera K.', 'Joseph D\'Souza', 'Priya Nair', 'Arjun Bose', 'Sneha Ghosh', 'Kabir Ali'];
  const localities = ['Salt Lake', 'Park Circus', 'New Town', 'Ballygunge', 'Dum Dum', 'Howrah', 'Behala', 'Garia'];
  return names.map((name, i) => ({
    id: `l${i}`, name, hue: Math.round(r() * 360),
    locality: localities[i % localities.length],
    verifiedAll: Math.max(1, Math.round(18 - i * 1.3 + r() * 2)),
    verifiedMonth: i < 9 ? Math.max(0, Math.round(2 - i * 0.2 + r())) : 0,
    publicRanking: i !== 10,
  }));
}

export function sampleDonors() {
  const r = rng(42);
  const total = GROUP_WEIGHTS.reduce((a, b) => a + b, 0);
  return Array.from({ length: 160 }, (_, i) => {
    let pick = r() * total;
    let g = 0;
    while (pick > GROUP_WEIGHTS[g]) { pick -= GROUP_WEIGHTS[g]; g++; }
    return { id: `d${i}`, alias: `Donor #${(1000 + i * 37) % 9000}`, bloodGroup: GROUPS[Math.min(g, 7)], distanceKm: Math.round(r() * 280) / 10, consent: r() > 0.15, available: r() > 0.3 };
  });
}

export function createSeedState(now = new Date()) {
  const t = now.getTime();
  return {
    hydrated: true, signedIn: false, account: null,
    assessments: [], documents: [], respondedRequestIds: [], donations: [], actionHistory: [],
    requests: sampleRequests(t), posts: samplePosts(t),
    hospitals: SAMPLE_HOSPITALS, leaderboard: sampleLeaders(),
    notifications: [], donors: sampleDonors(), blockedUserIds: [], reminder: {},
  };
}
