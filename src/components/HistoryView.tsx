import { Play, Pause, Trash2, Clock, Download } from "lucide-react";
import { Track, formatDuration, getDownloadUrl } from "@/lib/api";
import { usePlayer } from "@/contexts/PlayerContext";
import { useListeningHistory, HistoryEntry } from "@/hooks/useListeningHistory";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function HistoryView() {
  const { history, clearHistory } = useListeningHistory();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const isCurrentlyPlaying = (track: Track) =>
    currentTrack?.id === track.id && isPlaying;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  const handleDownload = (track: Track) => {
    const a = document.createElement("a");
    a.href = getDownloadUrl(track.url, track.title);
    a.download = `${track.title}.mp3`;
    a.click();
    toast.success(`Baixando "${track.title}"...`);
  };

  const allTracks = history.map(e => e.track);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="p-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              Histórico
            </h1>
            <p className="text-muted-foreground mt-1">
              {history.length} {history.length === 1 ? "música" : "músicas"} no histórico
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearHistory}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </motion.div>

        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-muted/50">
                <Clock className="h-10 w-10 text-muted-foreground/50" />
              </div>
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">Nenhum histórico ainda</p>
            <p className="text-sm text-muted-foreground">Comece a ouvir para ver seu histórico aqui</p>
          </motion.div>
        ) : (
          <div className="space-y-1">
            {history.map((entry, i) => {
              const playing = isCurrentlyPlaying(entry.track);
              return (
                <motion.div
                  key={`${entry.track.id}-${entry.playedAt}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-3 rounded-xl p-3 transition-all duration-200 group cursor-pointer ${
                    playing ? "bg-primary/10" : "hover:bg-muted/50"
                  }`}
                  onClick={() => playing ? togglePlay() : playTrack(entry.track, allTracks)}
                >
                  <div className="w-8 flex items-center justify-center flex-shrink-0">
                    {playing ? (
                      <div className="flex items-end gap-[2px] h-4">
                        <div className="equalizer-bar" />
                        <div className="equalizer-bar" />
                        <div className="equalizer-bar" />
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-muted-foreground group-hover:hidden tabular-nums">{i + 1}</span>
                        <Play className="h-4 w-4 text-foreground hidden group-hover:block" />
                      </>
                    )}
                  </div>

                  <img
                    src={entry.track.thumbnail}
                    alt={entry.track.title}
                    className="h-12 w-12 rounded-lg object-cover flex-shrink-0 shadow-lg"
                  />

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${playing ? "text-primary" : "text-foreground"}`}>
                      {entry.track.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.track.artist}</p>
                  </div>

                  <span className="text-xs text-muted-foreground/60 hidden sm:block">{formatDate(entry.playedAt)}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{formatDuration(entry.track.duration)}</span>

                  <button
                    onClick={e => { e.stopPropagation(); handleDownload(entry.track); }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
