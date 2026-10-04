import { afterEach, describe, expect, it, vi } from "vitest";
import { buscarCEP } from "@/lib/viacep";

const respostaFetch = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("buscarCEP", () => {
  it("consulta o ViaCEP só com os dígitos e devolve o endereço", async () => {
    const fetchMock = respostaFetch({ cep: "69005-010", localidade: "Manaus", uf: "AM" });
    vi.stubGlobal("fetch", fetchMock);

    const resultado = await buscarCEP("69005-010");

    expect(fetchMock).toHaveBeenCalledWith("https://viacep.com.br/ws/69005010/json/");
    expect(resultado?.localidade).toBe("Manaus");
  });

  it("rejeita CEP com tamanho inválido sem chamar a API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(buscarCEP("123")).rejects.toThrow("CEP inválido");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("informa quando o CEP não existe", async () => {
    vi.stubGlobal("fetch", respostaFetch({ erro: true }));
    await expect(buscarCEP("00000000")).rejects.toThrow("CEP não encontrado");
  });

  it("informa falha de rede/HTTP", async () => {
    vi.stubGlobal("fetch", respostaFetch({}, false));
    await expect(buscarCEP("69005010")).rejects.toThrow("Erro ao buscar CEP");
  });
});
