import { usePlayer } from "@/contexts/PlayerContext";
import { formatDuration } from "@/lib/api";
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX, Volume1, Download
} from "lucide-react";
import { getDownloadUrl } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    togglePlay, seekTo, setVolume, nextTrack, prevTrack,
    isShuffle, toggleShuffle, repeatMode, toggleRepeat,
  } = usePlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = getDownloadUrl(currentTrack.url, currentTrack.title);
    a.download = `${currentTrack.title}.mp3`;
    a.click();
    toast.success(`Baixando "${currentTrack.title}"...`);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50"
        style={{
          background: "linear-gradient(to top, hsl(var(--player-bg)), hsl(var(--player-bg) / 0.95))",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Progress bar at top of player */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seekTo(pct * duration);
          }}
        >
          <div
            className="h-full bg-primary transition-all duration-150 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary glow-primary-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="mx-auto flex h-20 max-w-screen-2xl items-center gap-4 px-4">
          {/* Track info */}
          <div className="flex items-center gap-3 w-[280px] min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className={`h-14 w-14 rounded-xl object-cover shadow-xl ${isPlaying ? "animate-pulse-glow" : ""}`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{currentTrack.artist}</p>
            </div>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0 ml-1"
              title="Baixar"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex items-center gap-5">
              <button
                onClick={toggleShuffle}
                className={`p-1.5 rounded-lg transition-all ${
                  isShuffle ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shuffle className="h-4 w-4" />
              </button>
              <button onClick={prevTrack} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background hover:scale-110 transition-all duration-200 shadow-lg"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="h-5 w-5" />
              </button>
              <button
                onClick={toggleRepeat}
                className={`p-1.5 rounded-lg transition-all ${
                  repeatMode !== "off" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {repeatMode === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
              </button>
            </div>

            {/* Time display */}
            <div className="flex w-full max-w-md items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-10 text-right tabular-nums">
                {formatDuration(currentTime)}
              </span>
              <div className="relative flex-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={e => seekTo(Number(e.target.value))}
                  className="w-full h-1 cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%)`,
                  }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground w-10 tabular-nums">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 w-[160px] justify-end">
            <button
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <VolumeIcon className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-24 h-1"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%)`,
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
