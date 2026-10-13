// Data access layer — all Supabase queries live here.
import { supabase } from './supabase';

const must = ({ data, error }) => { if (error) throw error; return data; };

/** Upcoming sessions (from start of today), sorted by date, each with a roster [{id,name,avatar_url}]. */
export async function fetchUpcomingSessions({ limit = 6 } = {}) {
  if (!supabase) return [];
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const sessions = must(await supabase
    .from('sessions').select('*')
    .gte('starts_at', startOfToday.toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit));
  return attachRoster(sessions, startOfToday);
}

/** Recent + upcoming sessions for the admin screen. */
export async function fetchAdminSessions() {
  const from = new Date(Date.now() - 21 * 864e5);
  const sessions = must(await supabase
    .from('sessions').select('*')
    .gte('starts_at', from.toISOString())
    .order('starts_at', { ascending: true }));
  const withRoster = await attachRoster(sessions, from);
  const ids = sessions.map(s => s.id);
  const att = ids.length
    ? must(await supabase.from('attendance').select('session_id,user_id').in('session_id', ids))
    : [];
  return withRoster.map(s => ({
    ...s,
    presentIds: att.filter(a => a.session_id === s.id).map(a => a.user_id),
  }));
}

async function attachRoster(sessions, from) {
  if (!sessions.length) return [];
  const roster = must(await supabase.rpc('session_roster', { p_from: from.toISOString() })) ?? [];
  return sessions.map(s => ({
    ...s,
    participants: roster
      .filter(r => r.session_id === s.id)
      .map(r => ({ id: r.user_id, name: r.full_name || '?', avatar_url: r.avatar_url })),
  }));
}

export async function register(sessionId, userId) {
  must(await supabase.from('registrations').insert({ session_id: sessionId, user_id: userId }));
}
export async function unregister(sessionId, userId) {
  must(await supabase.from('registrations').delete().eq('session_id', sessionId).eq('user_id', userId));
}

export async function fetchStudents() {
  return must(await supabase.from('profiles').select('*').order('full_name'));
}
export async function adjustCredits(userId, delta, reason = 'adjustment') {
  return must(await supabase.rpc('admin_adjust_credits', { p_user: userId, p_delta: delta, p_reason: reason }));
}
export async function setAttendance(sessionId, userId, present) {
  return must(await supabase.rpc('admin_set_attendance', { p_session: sessionId, p_user: userId, p_present: present }));
}

// ─── Formatting ──────────────────────────────────────────────────────────────
const TZ = 'Asia/Jerusalem';
export const sessionLabel = (iso) =>
  new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ }).format(new Date(iso));
export const sessionTime = (iso) =>
  new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(new Date(iso));
export const isPast = (iso) => new Date(iso).getTime() < Date.now();

// ─── Class info (single row: song name, dance style) ────────────────────────
export async function fetchClassInfo() {
  if (!supabase) return null;
  return must(await supabase.from('class_info').select('song_name,dance_style').eq('id', true).maybeSingle());
}
export async function updateClassInfo({ song_name, dance_style }, userId) {
  const clean = v => (v ?? '').trim() || null;
  must(await supabase.from('class_info')
    .update({ song_name: clean(song_name), dance_style: clean(dance_style), updated_at: new Date().toISOString(), updated_by: userId })
    .eq('id', true));
}
export const EMPTY_INFO = 'אין כרגע';
