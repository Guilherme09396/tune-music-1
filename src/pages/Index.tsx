import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SearchView from "@/components/SearchView";
import PlaylistView from "@/components/PlaylistView";
import PlayerBar from "@/components/PlayerBar";
import HomeView from "@/components/HomeView";
import HistoryView from "@/components/HistoryView";
import { usePlaylistStore } from "@/hooks/usePlaylistStore";
import { PlayerProvider, usePlayer } from "@/contexts/PlayerContext";
import { useListeningHistory } from "@/hooks/useListeningHistory";
import { Track } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function AppContent() {
  const [activeView, setActiveView] = useState("home");
  const { playlists, createPlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist } = usePlaylistStore();
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<Track | null>(null);
  const { addToHistory } = useListeningHistory();
  const { currentTrack } = usePlayer();

  // Track listening history
  useEffect(() => {
    if (currentTrack) {
      addToHistory(currentTrack);
    }
  }, [currentTrack?.id]);

  const activePlaylist = useMemo(() => {
    if (!activeView.startsWith("playlist:")) return null;
    const id = activeView.split(":")[1];
    return playlists.find(p => p.id === id) || null;
  }, [activeView, playlists]);

  const handleAddToPlaylist = (track: Track) => {
    if (playlists.length === 0) {
      const id = createPlaylist("Minha Playlist");
      addTrackToPlaylist(id, track);
    } else if (playlists.length === 1) {
      addTrackToPlaylist(playlists[0].id, track);
    } else {
      setAddToPlaylistTrack(track);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        playlists={playlists.map(p => ({ id: p.id, name: p.name }))}
        activeView={activeView}
        onViewChange={setActiveView}
        onCreatePlaylist={createPlaylist}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {activeView === "home" && (
          <HomeView onNavigate={setActiveView} />
        )}
        {activeView === "search" && (
          <SearchView onAddToPlaylist={handleAddToPlaylist} />
        )}
        {activeView === "history" && (
          <HistoryView />
        )}
        {activePlaylist && (
          <PlaylistView
            playlist={activePlaylist}
            onRemoveTrack={trackId => removeTrackFromPlaylist(activePlaylist.id, trackId)}
            onDeletePlaylist={() => {
              deletePlaylist(activePlaylist.id);
              setActiveView("home");
            }}
          />
        )}
      </main>

      <PlayerBar />

      {/* Select playlist dialog */}
      <Dialog open={!!addToPlaylistTrack} onOpenChange={() => setAddToPlaylistTrack(null)}>
        <DialogContent className="bg-card border-border/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Adicionar à playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 mt-2">
            {playlists.map(pl => (
              <Button
                key={pl.id}
                variant="ghost"
                className="w-full justify-start rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={() => {
                  if (addToPlaylistTrack) {
                    addTrackToPlaylist(pl.id, addToPlaylistTrack);
                    setAddToPlaylistTrack(null);
                  }
                }}
              >
                {pl.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Index() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
