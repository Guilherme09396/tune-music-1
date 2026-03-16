import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Track } from "@/lib/api";

export interface HistoryEntry {
  track: Track;
  playedAt: number;
}

const MAX_HISTORY = 50;

export function useListeningHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!user) { setHistory([]); return; }
    const key = `soundflow_history_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch { setHistory([]); }
    }
  }, [user]);

  const persist = useCallback((entries: HistoryEntry[]) => {
    if (!user) return;
    localStorage.setItem(`soundflow_history_${user.id}`, JSON.stringify(entries));
  }, [user]);

  const addToHistory = useCallback((track: Track) => {
    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(e => e.track.id !== track.id);
      const next = [{ track, playedAt: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
      persist(next);
      return next;
    });
  }, [persist]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (user) localStorage.removeItem(`soundflow_history_${user.id}`);
  }, [user]);

  // Get unique artists from history for recommendations
  const topArtists = Array.from(
    new Set(history.map(e => e.track.artist))
  ).slice(0, 5);

  const recentTracks = history.slice(0, 10).map(e => e.track);

  return { history, recentTracks, topArtists, addToHistory, clearHistory };
}
