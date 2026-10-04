import { describe, expect, it } from "vitest";
import { formatCNPJ, validateCNPJ } from "@/lib/cnpj";

describe("formatCNPJ", () => {
  it("aplica a máscara 00.000.000/0000-00", () => {
    expect(formatCNPJ("11222333000181")).toBe("11.222.333/0001-81");
  });

  it("ignora caracteres que não são dígitos", () => {
    expect(formatCNPJ("11.222.333/0001-81")).toBe("11.222.333/0001-81");
  });

  it("formata parcialmente enquanto o usuário digita", () => {
    expect(formatCNPJ("11222")).toBe("11.222");
  });
});

describe("validateCNPJ", () => {
  it("aceita CNPJ com dígitos verificadores corretos", () => {
    expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
  });

  it("rejeita dígito verificador errado", () => {
    expect(validateCNPJ("11.222.333/0001-82")).toBe(false);
  });

  it("rejeita sequências repetidas", () => {
    expect(validateCNPJ("00000000000000")).toBe(false);
    expect(validateCNPJ("11111111111111")).toBe(false);
  });

  it("rejeita tamanho diferente de 14 dígitos", () => {
    expect(validateCNPJ("1122233300018")).toBe(false);
    expect(validateCNPJ("")).toBe(false);
  });
});
