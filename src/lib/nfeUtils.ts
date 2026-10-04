import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import type { DadosFiscaisNFe, EmpresaNFe, ItemNFe, NotaFiscal as NotaFiscalBase } from "@/types/nfe";

// Tipos para o autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

type NotaFiscal = NotaFiscalBase;
type Empresa = EmpresaNFe;

// Gerar chave de acesso simulada (44 dígitos)
export const gerarChaveAcesso = (nota: NotaFiscal, empresa: Empresa): string => {
  const cUF = "13"; // AM
  const AAMM = format(new Date(nota.data_emissao), "yyMM");
  const cnpj = (empresa.cnpj || "").replace(/\D/g, "").padStart(14, "0");
  const mod = "55"; // NF-e
  const serie = String(nota.serie).padStart(3, "0");
  const nNF = String(nota.numero).padStart(9, "0");
  const tpEmis = "1"; // Normal
  const cNF = String(Math.floor(Math.random() * 100000000)).padStart(8, "0");
  
  const chave = `${cUF}${AAMM}${cnpj}${mod}${serie}${nNF}${tpEmis}${cNF}`;
  
  // Dígito verificador simplificado
  let soma = 0;
  let peso = 2;
  for (let i = chave.length - 1; i >= 0; i--) {
    soma += parseInt(chave[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  const resto = soma % 11;
  const dv = resto < 2 ? 0 : 11 - resto;
  
  return `${chave}${dv}`;
};

// Formatar chave de acesso: 1325 1112 3456 ...
export const formatarChaveAcesso = (chave: string): string => {
  if (!chave || chave.length !== 44) return chave;
  return chave.match(/.{1,4}/g)?.join(" ") || chave;
};

// Formatar CNPJ/CPF
export const formatarCpfCnpj = (valor: string): string => {
  const numeros = (valor || "").replace(/\D/g, "");
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (numeros.length === 14) {
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return valor;
};

// Escapa caracteres especiais para não gerar XML inválido (ex.: "Café & Cia")
export const escapeXml = (valor: unknown): string =>
  String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Destinatário pessoa física usa <CPF> (11 dígitos); pessoa jurídica usa <CNPJ>
export const tagDocumento = (documento?: string | null): string => {
  const numeros = (documento || "").replace(/\D/g, "");
  return numeros.length === 11 ? `<CPF>${numeros}</CPF>` : `<CNPJ>${numeros}</CNPJ>`;
};

// Gerar XML da NF-e
export const gerarXMLNFe = (nota: NotaFiscal, empresa: Empresa): string => {
  const dadosFiscais = (nota.dados_fiscais ?? {}) as DadosFiscaisNFe;
  const destinatario = dadosFiscais.destinatario || {};
  const itens = dadosFiscais.itens || [];
  const totais = dadosFiscais.totais || {};
  const chaveAcesso = gerarChaveAcesso(nota, empresa);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
    <infNFe versao="4.00" Id="NFe${chaveAcesso}">
      <ide>
        <cUF>13</cUF>
        <cNF>${String(nota.numero).padStart(8, "0")}</cNF>
        <natOp>${escapeXml(nota.natureza_operacao)}</natOp>
        <mod>55</mod>
        <serie>${nota.serie}</serie>
        <nNF>${nota.numero}</nNF>
        <dhEmi>${new Date(nota.data_emissao).toISOString()}</dhEmi>
        <tpNF>1</tpNF>
        <idDest>1</idDest>
        <cMunFG>1302603</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
        <tpAmb>2</tpAmb>
        <finNFe>1</finNFe>
        <indFinal>1</indFinal>
        <indPres>1</indPres>
        <procEmi>0</procEmi>
        <verProc>AMVIX 1.0</verProc>
      </ide>
      <emit>
        <CNPJ>${(empresa.cnpj || "").replace(/\D/g, "")}</CNPJ>
        <xNome>${escapeXml(empresa.razao_social)}</xNome>
        <xFant>${escapeXml(empresa.nome_fantasia)}</xFant>
        <enderEmit>
          <xLgr>${escapeXml(empresa.logradouro || "")}</xLgr>
          <nro>${escapeXml(empresa.numero || "S/N")}</nro>
          <xBairro>${escapeXml(empresa.bairro || "")}</xBairro>
          <cMun>1302603</cMun>
          <xMun>${escapeXml(empresa.cidade || "")}</xMun>
          <UF>${escapeXml(empresa.estado || "")}</UF>
          <CEP>${(empresa.cep || "").replace(/\D/g, "")}</CEP>
          <cPais>1058</cPais>
          <xPais>Brasil</xPais>
          <fone>${(empresa.telefone || "").replace(/\D/g, "")}</fone>
        </enderEmit>
        <IE>${(empresa.inscricao_estadual || "").replace(/\D/g, "")}</IE>
        <CRT>3</CRT>
      </emit>
      <dest>
        ${tagDocumento(destinatario.cnpj_cpf || nota.clientes_fornecedores?.cpf_cnpj)}
        <xNome>${escapeXml(destinatario.razao_social || nota.clientes_fornecedores?.nome_razao_social || "")}</xNome>
        <enderDest>
          <xLgr>${escapeXml(destinatario.endereco || "")}</xLgr>
          <nro>${escapeXml(destinatario.numero || "S/N")}</nro>
          <xBairro>${escapeXml(destinatario.bairro || "")}</xBairro>
          <cMun>1302603</cMun>
          <xMun>${escapeXml(destinatario.cidade || "")}</xMun>
          <UF>${escapeXml(destinatario.uf || "")}</UF>
          <CEP>${(destinatario.cep || "").replace(/\D/g, "")}</CEP>
          <cPais>1058</cPais>
          <xPais>Brasil</xPais>
        </enderDest>
        <indIEDest>9</indIEDest>
        <email>${escapeXml(destinatario.email || nota.clientes_fornecedores?.email || "")}</email>
      </dest>
      ${itens.map((item: ItemNFe, index: number) => `
      <det nItem="${index + 1}">
        <prod>
          <cProd>${escapeXml(item.codigo || index + 1)}</cProd>
          <cEAN>SEM GTIN</cEAN>
          <xProd>${escapeXml(item.descricao || "")}</xProd>
          <NCM>${escapeXml(item.ncm || "00000000")}</NCM>
          <CFOP>${escapeXml(item.cfop || "5102")}</CFOP>
          <uCom>${escapeXml(item.unidade || "UN")}</uCom>
          <qCom>${item.quantidade || 1}</qCom>
          <vUnCom>${Number(item.valor_unitario || 0).toFixed(4)}</vUnCom>
          <vProd>${Number(item.valor_total || 0).toFixed(2)}</vProd>
          <cEANTrib>SEM GTIN</cEANTrib>
          <uTrib>${escapeXml(item.unidade || "UN")}</uTrib>
          <qTrib>${item.quantidade || 1}</qTrib>
          <vUnTrib>${Number(item.valor_unitario || 0).toFixed(4)}</vUnTrib>
          <indTot>1</indTot>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <modBC>0</modBC>
              <vBC>${Number(item.valor_total || 0).toFixed(2)}</vBC>
              <pICMS>${item.icms_aliquota || 18}</pICMS>
              <vICMS>${Number(item.icms_valor || 0).toFixed(2)}</vICMS>
            </ICMS00>
          </ICMS>
          <PIS>
            <PISAliq>
              <CST>01</CST>
              <vBC>${Number(item.valor_total || 0).toFixed(2)}</vBC>
              <pPIS>1.65</pPIS>
              <vPIS>${Number(item.pis_valor || 0).toFixed(2)}</vPIS>
            </PISAliq>
          </PIS>
          <COFINS>
            <COFINSAliq>
              <CST>01</CST>
              <vBC>${Number(item.valor_total || 0).toFixed(2)}</vBC>
              <pCOFINS>7.60</pCOFINS>
              <vCOFINS>${Number(item.cofins_valor || 0).toFixed(2)}</vCOFINS>
            </COFINSAliq>
          </COFINS>
        </imposto>
      </det>`).join("")}
      <total>
        <ICMSTot>
          <vBC>${Number(totais.baseIcms || 0).toFixed(2)}</vBC>
          <vICMS>${Number(totais.valorIcms || 0).toFixed(2)}</vICMS>
          <vICMSDeson>0.00</vICMSDeson>
          <vFCP>0.00</vFCP>
          <vBCST>0.00</vBCST>
          <vST>0.00</vST>
          <vFCPST>0.00</vFCPST>
          <vFCPSTRet>0.00</vFCPSTRet>
          <vProd>${Number(totais.totalProdutos || nota.valor_total || 0).toFixed(2)}</vProd>
          <vFrete>0.00</vFrete>
          <vSeg>0.00</vSeg>
          <vDesc>0.00</vDesc>
          <vII>0.00</vII>
          <vIPI>${Number(totais.valorIpi || 0).toFixed(2)}</vIPI>
          <vIPIDevol>0.00</vIPIDevol>
          <vPIS>${Number(totais.valorPis || 0).toFixed(2)}</vPIS>
          <vCOFINS>${Number(totais.valorCofins || 0).toFixed(2)}</vCOFINS>
          <vOutro>0.00</vOutro>
          <vNF>${Number(nota.valor_total || 0).toFixed(2)}</vNF>
        </ICMSTot>
      </total>
      <transp>
        <modFrete>9</modFrete>
      </transp>
      <pag>
        <detPag>
          <tPag>01</tPag>
          <vPag>${Number(nota.valor_total || 0).toFixed(2)}</vPag>
        </detPag>
      </pag>
      <infAdic>
        <infCpl>Documento emitido pelo sistema AMVIX - ${format(new Date(), "dd/MM/yyyy HH:mm:ss")}</infCpl>
      </infAdic>
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>2</tpAmb>
      <verAplic>AM.NF-E.4.00</verAplic>
      <chNFe>${chaveAcesso}</chNFe>
      <dhRecbto>${new Date().toISOString()}</dhRecbto>
      <nProt>${String(Date.now()).slice(-15)}</nProt>
      <digVal>${btoa(chaveAcesso.slice(0, 20))}</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;

  return xml;
};

// Download do XML
export const downloadXMLNFe = (nota: NotaFiscal, empresa: Empresa): void => {
  const xml = gerarXMLNFe(nota, empresa);
  const chaveAcesso = gerarChaveAcesso(nota, empresa);
  
  const blob = new Blob([xml], { type: "application/xml" });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `NFe_${chaveAcesso}.xml`;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Gerar DANFE PDF - Layout oficial Receita Federal
export const gerarPDFNFe = (nota: NotaFiscal, empresa: Empresa): void => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const dadosFiscais = (nota.dados_fiscais ?? {}) as DadosFiscaisNFe;
  const destinatario = dadosFiscais.destinatario || {};
  const itens = dadosFiscais.itens || [];
  const totais = dadosFiscais.totais || {};
  const chaveAcesso = gerarChaveAcesso(nota, empresa);
  const protocolo = `${String(Date.now()).slice(-13)} - ${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`;
  
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 5;
  const contentWidth = pageWidth - 2 * margin; // 200mm
  let y = margin;
  
  // Cores e estilos
  const borderColor = 0;
  doc.setDrawColor(borderColor);
  doc.setLineWidth(0.3);

  // =====================================================
  // RECIBO DO DESTINATÁRIO (Canhoto)
  // =====================================================
  const reciboHeight = 22;
  doc.rect(margin, y, contentWidth, reciboHeight);
  
  // Texto do recibo
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  const textoRecibo = `RECEBEMOS DE ${empresa.razao_social} OS PRODUTOS E/OU SERVIÇOS CONSTANTES DA NOTA FISCAL ELETRÔNICA INDICADA ABAIXO.`;
  doc.text(textoRecibo, margin + 2, y + 4, { maxWidth: contentWidth - 60 });
  
  // Info do recibo
  doc.setFontSize(5);
  doc.text(`EMISSÃO: ${format(new Date(nota.data_emissao), "dd/MM/yyyy")}`, margin + 2, y + 8);
  doc.text(`VALOR TOTAL: R$ ${Number(nota.valor_total || 0).toFixed(2)}`, margin + 40, y + 8);
  
  const nomeDestinatario = destinatario.razao_social || nota.clientes_fornecedores?.nome_razao_social || "";
  const enderecoDestinatario = `${destinatario.endereco || nota.clientes_fornecedores?.endereco || ""}, ${destinatario.numero || nota.clientes_fornecedores?.numero || ""} - ${destinatario.bairro || nota.clientes_fornecedores?.bairro || ""} - ${destinatario.cidade || nota.clientes_fornecedores?.cidade || ""}/${destinatario.uf || nota.clientes_fornecedores?.uf || ""}`;
  doc.text(`DESTINATÁRIO: ${nomeDestinatario} - ${enderecoDestinatario}`.substring(0, 120), margin + 2, y + 12);
  
  // NF-e box no recibo
  const nfeBoxX = margin + contentWidth - 55;
  doc.line(nfeBoxX, y, nfeBoxX, y + reciboHeight);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("NF-e", nfeBoxX + 3, y + 5);
  doc.setFontSize(7);
  doc.text(`Nº. ${String(nota.numero).padStart(9, "0").replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3")}`, nfeBoxX + 3, y + 9);
  doc.text(`Série ${String(nota.serie).padStart(3, "0")}`, nfeBoxX + 3, y + 13);
  
  // Campos de assinatura
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("DATA DE RECEBIMENTO", margin + 90, y + 18);
  doc.text("IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR", margin + 120, y + 18);
  
  y += reciboHeight + 1;
  
  // Linha pontilhada de corte
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, y, margin + contentWidth, y);
  doc.setLineDashPattern([], 0);
  y += 2;

  // =====================================================
  // CABEÇALHO PRINCIPAL
  // =====================================================
  const headerHeight = 38;
  const col1Width = 85; // Emitente
  const col2Width = 30; // DANFE
  const col3Width = contentWidth - col1Width - col2Width; // Chave

  // Box principal do cabeçalho
  doc.rect(margin, y, contentWidth, headerHeight);
  
  // Coluna 1: EMITENTE
  doc.line(margin + col1Width, y, margin + col1Width, y + headerHeight);
  
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("IDENTIFICAÇÃO DO EMITENTE", margin + 2, y + 4);
  
  doc.setFontSize(9);
  doc.text(empresa.razao_social, margin + 2, y + 10);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  const enderecoEmitente = `${empresa.logradouro || ""}, ${empresa.numero || "S/N"}`;
  const cidadeEmitente = `${empresa.bairro || ""} - ${empresa.cidade || ""}/${empresa.estado || ""}`;
  const cepFoneEmitente = `CEP: ${empresa.cep || ""} - Fone/Fax: ${empresa.telefone || ""}`;
  
  doc.text(enderecoEmitente.substring(0, 50), margin + 2, y + 16);
  doc.text(cidadeEmitente.substring(0, 50), margin + 2, y + 20);
  doc.text(cepFoneEmitente.substring(0, 50), margin + 2, y + 24);
  
  // Coluna 2: DANFE
  doc.line(margin + col1Width + col2Width, y, margin + col1Width + col2Width, y + headerHeight);
  
  const danfeX = margin + col1Width + col2Width / 2;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DANFE", danfeX, y + 6, { align: "center" });
  
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("Documento Auxiliar da", danfeX, y + 10, { align: "center" });
  doc.text("Nota Fiscal Eletrônica", danfeX, y + 13, { align: "center" });
  
  doc.setFontSize(6);
  doc.text("0 - ENTRADA", danfeX, y + 18, { align: "center" });
  doc.text("1 - SAÍDA", danfeX, y + 21, { align: "center" });
  
  // Box tipo operação
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("1", danfeX + 10, y + 20);
  doc.rect(danfeX + 6, y + 16, 8, 6);
  
  doc.setFontSize(7);
  doc.text(`Nº. ${String(nota.numero).padStart(9, "0").replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3")}`, danfeX, y + 28, { align: "center" });
  doc.text(`Série ${String(nota.serie).padStart(3, "0")}`, danfeX, y + 32, { align: "center" });
  doc.setFontSize(6);
  doc.text("Folha 1/1", danfeX, y + 36, { align: "center" });
  
  // Coluna 3: CHAVE DE ACESSO
  const chaveX = margin + col1Width + col2Width + 2;
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("CHAVE DE ACESSO", chaveX, y + 4);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  const chaveFormatada = formatarChaveAcesso(chaveAcesso);
  doc.text(chaveFormatada, chaveX, y + 9);
  
  // Código de barras simulado (linhas verticais)
  const barcodeY = y + 12;
  const barcodeHeight = 12;
  doc.setLineWidth(0.5);
  for (let i = 0; i < 60; i++) {
    if (Math.random() > 0.3) {
      doc.line(chaveX + i * 1.2, barcodeY, chaveX + i * 1.2, barcodeY + barcodeHeight);
    }
  }
  doc.setLineWidth(0.3);
  
  doc.setFontSize(5);
  doc.text("Consulta de autenticidade no portal nacional da NF-e", chaveX, y + 30);
  doc.text("www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora", chaveX, y + 34);
  
  y += headerHeight;

  // =====================================================
  // NATUREZA DA OPERAÇÃO E PROTOCOLO
  // =====================================================
  const natProtHeight = 10;
  doc.rect(margin, y, contentWidth * 0.6, natProtHeight);
  doc.rect(margin + contentWidth * 0.6, y, contentWidth * 0.4, natProtHeight);
  
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("NATUREZA DA OPERAÇÃO", margin + 2, y + 3);
  doc.text("PROTOCOLO DE AUTORIZAÇÃO DE USO", margin + contentWidth * 0.6 + 2, y + 3);
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(nota.natureza_operacao, margin + 2, y + 8);
  doc.text(protocolo, margin + contentWidth * 0.6 + 2, y + 8);
  
  y += natProtHeight;

  // =====================================================
  // INSCRIÇÕES DO EMITENTE
  // =====================================================
  const inscHeight = 8;
  const inscW1 = contentWidth * 0.4;
  const inscW2 = contentWidth * 0.3;
  const inscW3 = contentWidth * 0.3;
  
  doc.rect(margin, y, inscW1, inscHeight);
  doc.rect(margin + inscW1, y, inscW2, inscHeight);
  doc.rect(margin + inscW1 + inscW2, y, inscW3, inscHeight);
  
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("INSCRIÇÃO ESTADUAL", margin + 2, y + 3);
  doc.text("INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT.", margin + inscW1 + 2, y + 3);
  doc.text("CNPJ", margin + inscW1 + inscW2 + 2, y + 3);
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(empresa.inscricao_estadual || "", margin + 2, y + 7);
  doc.text("", margin + inscW1 + 2, y + 7);
  doc.text(formatarCpfCnpj(empresa.cnpj), margin + inscW1 + inscW2 + 2, y + 7);
  
  y += inscHeight;

  // =====================================================
  // DESTINATÁRIO / REMETENTE
  // =====================================================
  const destHeight = 24;
  doc.rect(margin, y, contentWidth, destHeight);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, contentWidth, 4, "F");
  doc.setFillColor(255, 255, 255);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DESTINATÁRIO / REMETENTE", margin + 2, y + 3);
  
  const destY = y + 4;
  
  // Linha 1: Nome, CNPJ, Data Emissão
  doc.line(margin, destY, margin + contentWidth, destY);
  
  const destNomeW = contentWidth * 0.5;
  const destCnpjW = contentWidth * 0.25;
  const destDataW = contentWidth * 0.25;
  
  doc.line(margin + destNomeW, destY, margin + destNomeW, destY + 8);
  doc.line(margin + destNomeW + destCnpjW, destY, margin + destNomeW + destCnpjW, destY + 8);
  
  doc.setFontSize(5);
  doc.text("NOME / RAZÃO SOCIAL", margin + 2, destY + 3);
  doc.text("CNPJ / CPF", margin + destNomeW + 2, destY + 3);
  doc.text("DATA DA EMISSÃO", margin + destNomeW + destCnpjW + 2, destY + 3);
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(nomeDestinatario.substring(0, 40), margin + 2, destY + 7);
  const cnpjDest = destinatario.cnpj_cpf || nota.clientes_fornecedores?.cpf_cnpj || "";
  doc.text(formatarCpfCnpj(cnpjDest), margin + destNomeW + 2, destY + 7);
  doc.text(format(new Date(nota.data_emissao), "dd/MM/yyyy"), margin + destNomeW + destCnpjW + 2, destY + 7);
  
  // Linha 2: Endereço, Bairro, CEP, Data Saída
  const destY2 = destY + 8;
  doc.line(margin, destY2, margin + contentWidth, destY2);
  
  const endW = contentWidth * 0.35;
  const bairroW = contentWidth * 0.2;
  const cepW = contentWidth * 0.15;
  const dataSaidaW = contentWidth * 0.3;
  
  doc.line(margin + endW, destY2, margin + endW, destY2 + 8);
  doc.line(margin + endW + bairroW, destY2, margin + endW + bairroW, destY2 + 8);
  doc.line(margin + endW + bairroW + cepW, destY2, margin + endW + bairroW + cepW, destY2 + 8);
  
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("ENDEREÇO", margin + 2, destY2 + 3);
  doc.text("BAIRRO / DISTRITO", margin + endW + 2, destY2 + 3);
  doc.text("CEP", margin + endW + bairroW + 2, destY2 + 3);
  doc.text("DATA DA SAÍDA/ENTRADA", margin + endW + bairroW + cepW + 2, destY2 + 3);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  const endDest = `${destinatario.endereco || nota.clientes_fornecedores?.endereco || ""}, ${destinatario.numero || nota.clientes_fornecedores?.numero || ""}`;
  doc.text(endDest.substring(0, 35), margin + 2, destY2 + 7);
  doc.text((destinatario.bairro || nota.clientes_fornecedores?.bairro || "").substring(0, 15), margin + endW + 2, destY2 + 7);
  doc.text(destinatario.cep || nota.clientes_fornecedores?.cep || "", margin + endW + bairroW + 2, destY2 + 7);
  doc.text(format(new Date(nota.data_emissao), "dd/MM/yyyy"), margin + endW + bairroW + cepW + 2, destY2 + 7);
  
  // Linha 3: Município, UF, Fone, IE
  const destY3 = destY2 + 8;
  doc.line(margin, destY3, margin + contentWidth, destY3);
  
  const munW = contentWidth * 0.35;
  const ufW = contentWidth * 0.08;
  const foneW = contentWidth * 0.2;
  const ieW = contentWidth * 0.37;
  
  doc.line(margin + munW, destY3, margin + munW, y + destHeight);
  doc.line(margin + munW + ufW, destY3, margin + munW + ufW, y + destHeight);
  doc.line(margin + munW + ufW + foneW, destY3, margin + munW + ufW + foneW, y + destHeight);
  
  doc.setFontSize(5);
  doc.setFont("helvetica", "bold");
  doc.text("MUNICÍPIO", margin + 2, destY3 + 3);
  doc.text("UF", margin + munW + 2, destY3 + 3);
  doc.text("FONE / FAX", margin + munW + ufW + 2, destY3 + 3);
  doc.text("INSCRIÇÃO ESTADUAL", margin + munW + ufW + foneW + 2, destY3 + 3);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text((destinatario.cidade || nota.clientes_fornecedores?.cidade || "").substring(0, 25), margin + 2, destY3 + 7);
  doc.text(destinatario.uf || nota.clientes_fornecedores?.uf || "", margin + munW + 2, destY3 + 7);
  doc.text(destinatario.telefone || nota.clientes_fornecedores?.telefone || "", margin + munW + ufW + 2, destY3 + 7);
  doc.text(destinatario.ie || nota.clientes_fornecedores?.ie || "", margin + munW + ufW + foneW + 2, destY3 + 7);
  
  y += destHeight;

  // =====================================================
  // PAGAMENTO
  // =====================================================
  const pagHeight = 12;
  doc.rect(margin, y, contentWidth, pagHeight);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, contentWidth, 4, "F");
  doc.setFillColor(255, 255, 255);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("PAGAMENTO", margin + 2, y + 3);
  
  const pagY = y + 4;
  doc.line(margin, pagY, margin + contentWidth, pagY);
  doc.line(margin + 30, pagY, margin + 30, y + pagHeight);
  
  doc.setFontSize(5);
  doc.text("Forma", margin + 2, pagY + 3);
  doc.text("Valor", margin + 32, pagY + 3);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("Dinheiro", margin + 2, pagY + 7);
  doc.text(`R$ ${Number(nota.valor_total || 0).toFixed(2)}`, margin + 32, pagY + 7);
  
  y += pagHeight;

  // =====================================================
  // CÁLCULO DO IMPOSTO
  // =====================================================
  const impHeight = 18;
  doc.rect(margin, y, contentWidth, impHeight);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, contentWidth, 4, "F");
  doc.setFillColor(255, 255, 255);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("CÁLCULO DO IMPOSTO", margin + 2, y + 3);
  
  const impY = y + 4;
  const numCols = 9;
  const colW = contentWidth / numCols;
  
  // Linha 1 de impostos
  doc.line(margin, impY, margin + contentWidth, impY);
  for (let i = 1; i < numCols; i++) {
    doc.line(margin + i * colW, impY, margin + i * colW, impY + 7);
  }
  
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  const impLabels1 = ["BASE DE CÁLC. DO ICMS", "VALOR DO ICMS", "BASE DE CÁLC. ICMS S.T.", "VALOR DO ICMS SUBST.", "V. IMP. IMPORTAÇÃO", "V. ICMS UF REMET.", "V. FCP UF DEST.", "VALOR DO PIS", "V. TOTAL PRODUTOS"];
  impLabels1.forEach((label, i) => {
    doc.text(label, margin + i * colW + 1, impY + 3);
  });
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  const impVals1 = [
    Number(totais.baseIcms || nota.valor_total || 0).toFixed(2),
    Number(totais.valorIcms || 0).toFixed(2),
    "0,00",
    "0,00",
    "0,00",
    "0,00",
    "0,00",
    Number(totais.valorPis || 0).toFixed(2),
    Number(totais.totalProdutos || nota.valor_total || 0).toFixed(2)
  ];
  impVals1.forEach((val, i) => {
    doc.text(val, margin + i * colW + 1, impY + 6);
  });
  
  // Linha 2 de impostos
  const impY2 = impY + 7;
  doc.line(margin, impY2, margin + contentWidth, impY2);
  for (let i = 1; i < numCols; i++) {
    doc.line(margin + i * colW, impY2, margin + i * colW, y + impHeight);
  }
  
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  const impLabels2 = ["VALOR DO FRETE", "VALOR DO SEGURO", "DESCONTO", "OUTRAS DESPESAS", "VALOR TOTAL IPI", "V. ICMS UF DEST.", "V. TOT. TRIB.", "VALOR DA COFINS", "V. TOTAL DA NOTA"];
  impLabels2.forEach((label, i) => {
    doc.text(label, margin + i * colW + 1, impY2 + 3);
  });
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  const impVals2 = [
    "0,00",
    "0,00",
    "0,00",
    "0,00",
    Number(totais.valorIpi || 0).toFixed(2),
    "0,00",
    "0,00",
    Number(totais.valorCofins || 0).toFixed(2),
    Number(nota.valor_total || 0).toFixed(2)
  ];
  impVals2.forEach((val, i) => {
    const x = margin + i * colW + 1;
    if (i === 8) {
      doc.setFont("helvetica", "bold");
    }
    doc.text(val, x, impY2 + 6);
  });
  doc.setFont("helvetica", "normal");
  
  y += impHeight;

  // =====================================================
  // TRANSPORTADOR / VOLUMES TRANSPORTADOS
  // =====================================================
  const transpHeight = 12;
  doc.rect(margin, y, contentWidth, transpHeight);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, contentWidth, 4, "F");
  doc.setFillColor(255, 255, 255);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("TRANSPORTADOR / VOLUMES TRANSPORTADOS", margin + 2, y + 3);
  
  const transpY = y + 4;
  doc.line(margin, transpY, margin + contentWidth, transpY);
  
  const transpCols = [50, 35, 25, 30, 15, 45];
  let transpX = margin;
  transpCols.forEach((w, i) => {
    if (i > 0) {
      doc.line(transpX, transpY, transpX, y + transpHeight);
    }
    transpX += w;
  });
  
  doc.setFontSize(4);
  doc.setFont("helvetica", "bold");
  const transpLabels = ["NOME / RAZÃO SOCIAL", "FRETE", "CÓDIGO ANTT", "PLACA DO VEÍCULO", "UF", "CNPJ / CPF"];
  transpX = margin;
  transpLabels.forEach((label, i) => {
    doc.text(label, transpX + 1, transpY + 3);
    transpX += transpCols[i];
  });
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  transpX = margin;
  doc.text("", transpX + 1, transpY + 7);
  doc.text("9-Sem Transporte", margin + transpCols[0] + 1, transpY + 7);
  
  y += transpHeight;

  // =====================================================
  // DADOS DOS PRODUTOS / SERVIÇOS
  // =====================================================
  const prodHeaderHeight = 4;
  doc.rect(margin, y, contentWidth, prodHeaderHeight);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, contentWidth, prodHeaderHeight, "F");
  doc.setFillColor(255, 255, 255);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DOS PRODUTOS / SERVIÇOS", margin + 2, y + 3);
  
  y += prodHeaderHeight;

  // Tabela de produtos
  const produtosData = itens.map((item: ItemNFe) => [
    item.codigo || "-",
    (item.descricao || "").substring(0, 25),
    item.ncm || "00000000",
    item.cst || "000",
    item.cfop || "5102",
    item.unidade || "UN",
    Number(item.quantidade || 1).toFixed(4),
    Number(item.valor_unitario || 0).toFixed(4),
    Number(item.valor_total || 0).toFixed(2),
    "0,00",
    Number(item.valor_total || 0).toFixed(2),
    Number(item.icms_valor || 0).toFixed(2),
    Number(item.ipi_valor || 0).toFixed(2),
    `${item.icms_aliquota || 18}%`,
    "0%"
  ]);

  doc.autoTable({
    startY: y,
    head: [[
      "CÓD.\nPROD",
      "DESCRIÇÃO DO PRODUTO / SERVIÇO",
      "NCM/SH",
      "O/CST",
      "CFOP",
      "UN",
      "QUANT",
      "VALOR\nUNIT",
      "VALOR\nTOTAL",
      "VALOR\nDESC",
      "B.CÁLC\nICMS",
      "VALOR\nICMS",
      "VALOR\nIPI",
      "ALÍQ.\nICMS",
      "ALÍQ.\nIPI"
    ]],
    body: produtosData.length > 0 ? produtosData : [["", "Nenhum item", "", "", "", "", "", "", "", "", "", "", "", "", ""]],
    theme: "grid",
    styles: { 
      fontSize: 5, 
      cellPadding: 1,
      halign: "center",
      valign: "middle",
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: [240, 240, 240],
      textColor: 0,
      fontStyle: "bold",
      fontSize: 4
    },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 45, halign: "left" },
      2: { cellWidth: 14 },
      3: { cellWidth: 10 },
      4: { cellWidth: 10 },
      5: { cellWidth: 8 },
      6: { cellWidth: 14 },
      7: { cellWidth: 14 },
      8: { cellWidth: 14 },
      9: { cellWidth: 12 },
      10: { cellWidth: 14 },
      11: { cellWidth: 12 },
      12: { cellWidth: 11 },
      13: { cellWidth: 10 },
      14: { cellWidth: 10 }
    },
    margin: { left: margin, right: margin }
  });

  y = doc.lastAutoTable.finalY + 1;

  // =====================================================
  // DADOS ADICIONAIS
  // =====================================================
  const addHeight = 20;
  doc.rect(margin, y, contentWidth, addHeight);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, contentWidth, 4, "F");
  doc.setFillColor(255, 255, 255);
  
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("DADOS ADICIONAIS", margin + 2, y + 3);
  
  const addY = y + 4;
  doc.line(margin, addY, margin + contentWidth, addY);
  doc.line(margin + contentWidth * 0.7, addY, margin + contentWidth * 0.7, y + addHeight);
  
  doc.setFontSize(5);
  doc.text("INFORMAÇÕES COMPLEMENTARES", margin + 2, addY + 3);
  doc.text("RESERVADO AO FISCO", margin + contentWidth * 0.7 + 2, addY + 3);
  
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  const infoAdd = `Inf. Contribuinte: Documento emitido pelo sistema AMVIX - ${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`;
  doc.text(infoAdd, margin + 2, addY + 7);
  
  const emailDest = destinatario.email || nota.clientes_fornecedores?.email || "";
  if (emailDest) {
    doc.text(`Email do Destinatário: ${emailDest}`, margin + 2, addY + 11);
  }
  
  y += addHeight;

  // =====================================================
  // RODAPÉ
  // =====================================================
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text(`Impresso em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm:ss")}`, margin, y + 4);
  doc.text("Gerado pelo sistema AMVIX - www.amvix.com.br", margin + contentWidth / 2, y + 4, { align: "center" });

  // =====================================================
  // SALVAR PDF
  // =====================================================
  const nomeArquivo = `DANFE_${String(nota.numero).padStart(9, "0")}_${chaveAcesso.slice(-8)}.pdf`;
  doc.save(nomeArquivo);
};
