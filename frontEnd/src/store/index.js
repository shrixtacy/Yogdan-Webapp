// Zustand store — global app state persisted to localStorage
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSeedState } from '../lib/yogdan/seed';
import { advanceMatching, distanceBand } from '../lib/yogdan/matching';
import { weekKey } from '../lib/yogdan/rules';
import { api } from '../lib/api';

const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
const now = () => new Date().toISOString();

const DEFAULT_NOTIFICATION_PREFS = {
  nearby: true, responses: true, updates: true, verification: true,
  assessment: true, community: true, achievements: true,
};

// In-memory draft storage (not persisted — lives only during registration flow)
let registrationDraft = null;
export const getDraft = () => registrationDraft;
export const setDraft = (draft) => { registrationDraft = draft; };
export const clearDraft = () => { registrationDraft = null; };

const seed = createSeedState(new Date());

export const useStore = create(
  persist(
    (set, get) => ({
      ...seed,

      // ── Auth ──────────────────────────────────────────────────────────────
      signIn: () => set({ signedIn: true }),
      setHospitals: (hospitals) => set({ hospitals }),
      signOut: () => {
        localStorage.removeItem('yogdan-access-token');
        set({ signedIn: false });
      },
      hydrateFromApi: async () => {
        const [profile, requests, mine, records, actions, posts] = await Promise.all([
          api.profile(),
          api.requests(false),
          api.requests(true),
          api.records(),
          api.actions(),
          api.posts(),
        ]);
        const assessments = records.filter((record) => record.kind === 'assessment')
          .map((record) => ({ ...record.data, id: record._id, date: record.createdAt }));
        const documents = records.filter((record) => record.kind === 'document')
          .map((record) => ({ ...record.data, id: record._id, createdAt: record.createdAt }));
        const remoteRequests = [
          ...mine.map((request) => ({ ...request, id: request._id, mine: true, distanceKm: request.distanceKm ?? 0, responses: request.responses ?? [] })),
          ...requests.map((request) => ({ ...request, id: request._id, mine: false, distanceKm: request.distanceKm ?? 0, responses: request.responses ?? [] })),
        ];
        set({
          account: profile.user,
          requests: remoteRequests,
          assessments,
          documents,
          actionHistory: actions,
          posts: posts.map((post) => ({
            ...post,
            id: post._id,
            authorName: post.authorId?.name || 'Yogdan member',
            authorId: post.authorId?._id || post.authorId,
            likes: post.likes?.length || 0,
            likedByMe: false,
          })),
          signedIn: true,
        });
      },
      deleteAccount: () => {
        localStorage.removeItem('yogdan-state-v1');
        set({ ...createSeedState(new Date()) });
      },

      completeOnboarding: async (profile) => {
        const user = {
          ...profile,
          id: uid('user'),
          createdAt: now(),
          notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
          publicRanking: true,
          weeklyReminder: true,
        };
        set((state) => ({
          account: user,
          signedIn: true,
          notifications: [
            { id: uid('n'), kind: 'updates', title: 'Welcome to Yogdan', body: 'Your profile is ready. This preview runs on sample data.', at: now(), read: false, link: '/profile' },
            ...state.notifications,
          ],
        }));
        try {
          const result = await api.register(profile);
          localStorage.setItem('yogdan-access-token', result.token);
          set({ account: { ...user, ...result.user }, signedIn: true });
        } catch (error) {
          console.error('[Yogdan] Account registration failed:', error.message);
          throw error;
        }
      },

      // ── Profile ───────────────────────────────────────────────────────────
      updateProfile: async (patch) => {
        const result = await api.updateProfile(patch);
        set({ account: result.user });
      },

      addAction: async (action) => {
        const result = await api.addAction(action);
        set((state) => ({ actionHistory: [result, ...(state.actionHistory ?? [])] }));
      },

      // ── Notifications ─────────────────────────────────────────────────────
      markNotificationRead: (id) =>
        set((state) => ({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      markAllRead: () =>
        set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

      // ── Health assessments ────────────────────────────────────────────────
      saveAssessment: async (assessment) => {
        const result = await api.saveAssessment(assessment);
        set((state) => ({ assessments: [{ ...result.data, id: result._id, date: result.createdAt }, ...state.assessments], reminder: {} }));
      },
      deleteAssessment: (id) =>
        set((state) => ({ assessments: state.assessments.filter((a) => a.id !== id) })),
      snoozeReminder: (hours = 24) =>
        set((state) => ({ reminder: { ...state.reminder, snoozedUntil: new Date(Date.now() + hours * 3_600_000).toISOString() } })),
      skipReminderThisWeek: () =>
        set((state) => ({ reminder: { ...state.reminder, skippedWeekOf: weekKey(new Date()) } })),

      // ── Blood requests ────────────────────────────────────────────────────
      createRequest: async (input) => {
        const saved = await api.createRequest(input);
        const id = uid('req');
        const request = { ...saved, id: saved._id, mine: true, responses: [], matchStage: -1, notifiedDonorIds: [], stageCounts: [], distanceKm: 0 };
        set((state) => ({
          requests: [request, ...state.requests],
          actionHistory: [{ id: uid('action'), kind: 'Blood request', status: 'created', createdAt: now() }, ...(state.actionHistory ?? [])],
        }));
        get().expandMatching(id);
      },
      cancelRequest: async (id) => {
        await api.updateRequestStatus(id, 'cancelled');
        set((state) => ({ requests: state.requests.map((request) => request.id === id ? { ...request, status: 'cancelled' } : request) }));
      },

      expandMatching: (id) => {
        const state = get();
        const req = state.requests.find((r) => r.id === id);
        if (!req || req.status !== 'open') return;
        const result = advanceMatching(req, state.donors, new Date());
        if (!result) return;
        const notifiedSet = new Set(result.notified);
        set((s) => ({
          donors: s.donors.map((d) => notifiedSet.has(d.id) ? { ...d, lastNotifiedAt: now() } : d),
          requests: s.requests.map((r) => r.id === id ? { ...r, matchStage: result.stageIndex, notifiedDonorIds: [...r.notifiedDonorIds, ...result.notified], stageCounts: [...r.stageCounts, result.notified.length] } : r),
        }));
      },

      respondToRequest: async (id) => {
        if (get().respondedRequestIds.includes(id)) return;
        await api.respondToRequest(id);
        set((state) => ({
            respondedRequestIds: [id, ...state.respondedRequestIds],
            actionHistory: [{ id: uid('action'), kind: 'Donor response', requestId: id, status: 'sent', createdAt: now() }, ...(state.actionHistory ?? [])],
          }));
      },

      // ── Community ─────────────────────────────────────────────────────────
      toggleLike: async (id) => {
        const result = await api.likePost(id);
        set((state) => ({ posts: state.posts.map((p) => p.id === id ? { ...p, likedByMe: true, likes: result.likes } : p) }));
      },

      createPost: async ({ kind, text }) => {
        const acc = get().account;
        if (!acc) return;
        const saved = await api.createPost({ kind, text });
        const post = { ...saved, id: saved._id, authorName: acc.name, authorHue: 355, likedByMe: false, comments: [] };
        set((state) => ({ posts: [post, ...state.posts] }));
      },

      deletePost: (id) =>
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),

      blockUser: (userId) =>
        set((state) => ({
          blockedUserIds: state.blockedUserIds.includes(userId)
            ? state.blockedUserIds
            : [...state.blockedUserIds, userId],
        })),

      // ── Documents ─────────────────────────────────────────────────────────
      addDocument: async (doc) => {
        const saved = await api.addDocument(doc);
        set((state) => ({ documents: [{ ...saved.data, id: saved._id, createdAt: saved.createdAt }, ...(state.documents ?? [])] }));
      },

      deleteDocument: async (id) => {
        await api.deleteDocument(id);
        set((state) => ({ documents: (state.documents ?? []).filter((d) => d.id !== id) }));
      },

      renameDocument: (id, name) =>
        set((state) => ({ documents: (state.documents ?? []).map((d) => d.id === id ? { ...d, name } : d) })),

      // ── Donations ─────────────────────────────────────────────────────────
      submitDonation: (donation) =>
        set((state) => ({ donations: [{ ...donation, id: uid('don'), status: 'pending', submittedAt: now() }, ...state.donations] })),
    }),
    {
      name: 'yogdan-state-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { hydrated: _h, ...rest } = state;
        return rest;
      },
    },
  ),
);
