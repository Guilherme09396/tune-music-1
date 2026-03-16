import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music2, Loader2, Headphones, Radio, Disc3 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Login realizado!");
      } else {
        await signUp(email, password, name);
        toast.success("Conta criada! Verifique seu email.");
      }
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl scale-125" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary glow-primary">
                <Music2 className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-bold text-gradient mb-4">SoundFlow</h2>
          <p className="text-xl text-muted-foreground max-w-md">
            Sua música, seu jeito. Ouça, crie playlists e baixe suas músicas favoritas.
          </p>
          <div className="flex items-center justify-center gap-8 mt-12 text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <Headphones className="h-6 w-6 text-primary/70" />
              <span className="text-xs">Streaming</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Radio className="h-6 w-6 text-primary/70" />
              <span className="text-xs">Playlists</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Disc3 className="h-6 w-6 text-primary/70" />
              <span className="text-xs">Downloads</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary glow-primary-sm">
              <Music2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">SoundFlow</h1>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? "Entre para continuar ouvindo" : "Comece sua jornada musical"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required={!isLogin}
                  className="h-11 bg-muted/50 border-border/50 rounded-xl focus:ring-primary/30"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-11 bg-muted/50 border-border/50 rounded-xl focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11 bg-muted/50 border-border/50 rounded-xl focus:ring-primary/30"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-xl text-base font-semibold glow-primary-sm hover:glow-primary transition-all"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" />}
              {isLogin ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-semibold"
            >
              {isLogin ? "Criar conta" : "Fazer login"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
