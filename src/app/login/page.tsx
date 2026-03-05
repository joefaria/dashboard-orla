"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Warning } from "@phosphor-icons/react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
            <Lock size={24} weight="bold" className="text-accent" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Orla Analytics
          </h1>
          <p className="text-sm text-muted">
            Digite a senha para acessar o dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Senha de acesso"
              autoFocus
              className="w-full h-11 px-4 rounded-lg bg-surface-1 border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-danger">
              <Warning size={16} weight="bold" />
              <span>Senha incorreta</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="h-11 rounded-lg bg-accent text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
            {!loading && <ArrowRight size={16} weight="bold" />}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          Acesso restrito — Astra × Orla
        </p>
      </div>
    </div>
  );
}
