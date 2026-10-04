// Edge Function: admin-create-user
// Cria um usuário sem encerrar a sessão do administrador que está logado.
// Segurança:
//  - verify_jwt = true (config.toml): o gateway do Supabase rejeita chamadas sem JWT válido;
//  - a função confirma que quem chama tem o perfil "admin" na tabela user_roles;
//  - o perfil do novo usuário só pode ser um dos valores permitidos.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ROLES_PERMITIDOS = ["admin", "contador", "cliente"] as const;
type Role = (typeof ROLES_PERMITIDOS)[number];

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Método não permitido" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // 1. Identifica quem está chamando a partir do JWT
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return json({ error: "Não autenticado" }, 401);
    }
    const { data: caller, error: callerError } = await supabaseAdmin.auth.getUser(token);
    if (callerError || !caller.user) {
      return json({ error: "Sessão inválida" }, 401);
    }

    // 2. Só administradores podem criar usuários
    const { data: callerRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!callerRole) {
      return json({ error: "Apenas administradores podem criar usuários" }, 403);
    }

    // 3. Valida a entrada
    const { email, password, nome_completo, role } = await req.json();
    if (!email || !password) {
      return json({ error: "Email e senha são obrigatórios" }, 400);
    }
    if (typeof password !== "string" || password.length < 8) {
      return json({ error: "A senha deve ter no mínimo 8 caracteres" }, 400);
    }
    const novoRole: Role = role ?? "cliente";
    if (!ROLES_PERMITIDOS.includes(novoRole)) {
      return json({ error: "Perfil inválido" }, 400);
    }

    // 4. Cria o usuário (o trigger handle_new_user cria o perfil com role "cliente")
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome_completo: nome_completo || email },
    });
    if (userError || !userData.user) {
      return json({ error: userError?.message ?? "Erro ao criar usuário" }, 400);
    }

    // 5. Ajusta o perfil, se for diferente do padrão
    if (novoRole !== "cliente") {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .update({ role: novoRole })
        .eq("user_id", userData.user.id);
      if (roleError) {
        console.error("Erro ao atualizar role:", roleError);
      }
    }

    return json(
      { success: true, user: { id: userData.user.id, email: userData.user.email, role: novoRole } },
      201,
    );
  } catch (error: unknown) {
    console.error("admin-create-user:", error);
    return json({ error: "Erro interno" }, 500);
  }
});
