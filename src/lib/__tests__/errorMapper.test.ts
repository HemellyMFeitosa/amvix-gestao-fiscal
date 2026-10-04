import { describe, expect, it } from "vitest";
import {
  getErrorMessage,
  getSafeErrorMessage,
  isAuthError,
  isValidationError,
} from "@/lib/errorMapper";

describe("getSafeErrorMessage", () => {
  it("traduz códigos do PostgreSQL sem expor detalhes do banco", () => {
    expect(getSafeErrorMessage({ code: "23505", message: 'duplicate key "notas_pkey"' })).toBe(
      "Este registro já existe no sistema",
    );
  });

  it("traduz códigos do Supabase Auth", () => {
    expect(getSafeErrorMessage({ code: "invalid_credentials" })).toBe("E-mail ou senha incorretos");
  });

  it("traduz mensagens de RLS pelo padrão do texto", () => {
    expect(
      getSafeErrorMessage(new Error('new row violates row-level security policy for table "empresas"')),
    ).toBe("Você não tem permissão para acessar este recurso");
  });

  it("usa uma mensagem genérica para erros desconhecidos", () => {
    expect(getSafeErrorMessage(new Error("stack interno qualquer"))).toMatch(/Erro ao processar/);
  });

  it("trata ausência de erro", () => {
    expect(getSafeErrorMessage(null)).toBe("Erro desconhecido. Tente novamente.");
  });
});

describe("getErrorMessage", () => {
  it("lê a mensagem de Error, objetos e strings", () => {
    expect(getErrorMessage(new Error("falhou"))).toBe("falhou");
    expect(getErrorMessage({ error_description: "token expirado" })).toBe("token expirado");
    expect(getErrorMessage("texto")).toBe("texto");
  });

  it("retorna o fallback quando não há mensagem", () => {
    expect(getErrorMessage(undefined, "padrão")).toBe("padrão");
    expect(getErrorMessage(42, "padrão")).toBe("padrão");
  });
});

describe("classificação de erros", () => {
  it("identifica erros de permissão", () => {
    expect(isAuthError({ code: "42501" })).toBe(true);
    expect(isAuthError({ message: "Forbidden" })).toBe(true);
    expect(isAuthError({ code: "23505" })).toBe(false);
  });

  it("identifica erros de validação", () => {
    expect(isValidationError({ code: "23502" })).toBe(true);
    expect(isValidationError({ code: "42501" })).toBe(false);
  });
});
