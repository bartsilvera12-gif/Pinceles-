"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSupabase, type AdminProfile } from "@/lib/admin/spa";
import type { Session } from "@supabase/supabase-js";

type AuthState = {
  loading: boolean;
  session: Session | null;
  admin: AdminProfile | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  loading: true,
  session: null,
  admin: null,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Carga la sesión desde localStorage al montar y verifica el perfil admin
 * activo. Escucha cambios de auth (login/logout) para mantener el estado.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    const supabase = getSupabase();

    const resolve = async (sess: Session | null) => {
      if (!sess) {
        if (activeRef.current) {
          setSession(null);
          setAdmin(null);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("admin_profiles")
        .select("id, role, is_active, full_name, email")
        .eq("id", sess.user.id)
        .eq("is_active", true)
        .maybeSingle();
      if (activeRef.current) {
        setSession(sess);
        setAdmin((data as AdminProfile | null) ?? null);
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setLoading(true);
      resolve(sess);
    });

    return () => {
      activeRef.current = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await getSupabase().auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ loading, session, admin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
