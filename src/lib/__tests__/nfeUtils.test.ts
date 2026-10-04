import { describe, expect, it } from "vitest";
import {
  escapeXml,
  formatarChaveAcesso,
  formatarCpfCnpj,
  gerarChaveAcesso,
  gerarXMLNFe,
  tagDocumento,
} from "@/lib/nfeUtils";
import type { EmpresaNFe, NotaFiscal } from "@/types/nfe";

const empresa: EmpresaNFe = {
  razao_social: "Comércio Exemplo & Filhos LTDA",
  nome_fantasia: "Exemplo",
  cnpj: "11.222.333/0001-81",
  cidade: "Manaus",
  estado: "AM",
};

const nota: NotaFiscal = {
  id: "1",
  numero: 123,
  serie: 1,
  data_emissao: "2026-09-15T10:00:00Z",
  natureza_operacao: "Venda de mercadoria",
  status: "Autorizada",
  valor_total: 150,
  dados_fiscais: {
    destinatario: { razao_social: "Cliente <Teste>", cnpj_cpf: "123.456.789-09", uf: "AM" },
    itens: [{ codigo: "P1", descricao: "Parafuso 3/8\"", quantidade: 10, valor_unitario: 15, valor_total: 150 }],
    totais: { totalProdutos: 150 },
  },
};

// Dígito verificador da chave de acesso (módulo 11, pesos 2 a 9 da direita para a esquerda)
const dvEsperado = (chave43: string) => {
  let soma = 0;
  let peso = 2;
  for (let i = chave43.length - 1; i >= 0; i--) {
    soma += Number(chave43[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
};

describe("gerarChaveAcesso", () => {
  it("gera 44 dígitos com UF, CNPJ do emitente, modelo 55 e DV válido", () => {
    const chave = gerarChaveAcesso(nota, empresa);

    expect(chave).toMatch(/^\d{44}$/);
    expect(chave.slice(0, 2)).toBe("13"); // AM
    expect(chave.slice(6, 20)).toBe("11222333000181");
    expect(chave.slice(20, 22)).toBe("55");
    expect(Number(chave[43])).toBe(dvEsperado(chave.slice(0, 43)));
  });
});

describe("formatadores", () => {
  it("agrupa a chave de acesso de 4 em 4", () => {
    expect(formatarChaveAcesso("1".repeat(44))).toBe(Array(11).fill("1111").join(" "));
  });

  it("formata CPF e CNPJ", () => {
    expect(formatarCpfCnpj("12345678909")).toBe("123.456.789-09");
    expect(formatarCpfCnpj("11222333000181")).toBe("11.222.333/0001-81");
  });
});

describe("escapeXml e tagDocumento", () => {
  it("escapa caracteres especiais do XML", () => {
    expect(escapeXml(`A & B <C> "D" 'E'`)).toBe("A &amp; B &lt;C&gt; &quot;D&quot; &apos;E&apos;");
    expect(escapeXml(undefined)).toBe("");
  });

  it("usa <CPF> para pessoa física e <CNPJ> para pessoa jurídica", () => {
    expect(tagDocumento("123.456.789-09")).toBe("<CPF>12345678909</CPF>");
    expect(tagDocumento("11.222.333/0001-81")).toBe("<CNPJ>11222333000181</CNPJ>");
  });
});

describe("gerarXMLNFe", () => {
  const xml = gerarXMLNFe(nota, empresa);

  it("gera um XML bem formado mesmo com & e < nos nomes", () => {
    expect(xml).toContain("Comércio Exemplo &amp; Filhos LTDA");
    expect(xml).toContain("Cliente &lt;Teste&gt;");
    expect(xml).toContain("Parafuso 3/8&quot;");
    expect(xml).not.toContain("Exemplo & Filhos");
  });

  it("identifica destinatário pessoa física pelo CPF", () => {
    expect(xml).toContain("<CPF>12345678909</CPF>");
  });

  it("inclui número, série, itens e valor total", () => {
    expect(xml).toContain("<nNF>123</nNF>");
    expect(xml).toContain("<serie>1</serie>");
    expect(xml).toContain('<det nItem="1">');
    expect(xml).toContain("<vNF>150.00</vNF>");
  });
});
