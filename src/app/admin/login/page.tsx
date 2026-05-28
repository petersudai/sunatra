"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-light tracking-[0.15em] text-[#f5f0e8] mb-2">
            SUNATRA
          </h1>
          <p className="text-xs tracking-widest uppercase text-[#888880]">Admin</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-wider uppercase text-[#888880] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-4 py-3 text-sm text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wider uppercase text-[#888880] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm px-4 py-3 pr-11 text-sm text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555550] hover:text-[#c9a84c] transition-colors duration-200 p-0.5"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400/80 text-xs tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#c9a84c] text-[#0a0a0a] text-sm tracking-widest uppercase font-medium hover:bg-[#e2c278] disabled:opacity-50 transition-colors rounded-sm"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
