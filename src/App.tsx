import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmpresaProvider } from "@/contexts/EmpresaContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import CookieConsentWrapper from "@/components/CookieConsentWrapper";
// Páginas públicas
import Landing from "./pages/Landing";
import PreLogin from "./pages/PreLogin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Demonstracao from "./pages/Demonstracao";
import DemonstracaoConfirmacao from "./pages/DemonstracaoConfirmacao";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";
import NotFound from "./pages/NotFound";

// Páginas protegidas (qualquer usuário autenticado)
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Invoices from "./pages/Invoices";
import Integrations from "./pages/Integrations";
import Reports from "./pages/Reports";

// Páginas protegidas (admin e contador)
import NFe from "./pages/NFe";
import NFSe from "./pages/NFSe";
import NFCe from "./pages/NFCe";
import ValidacaoNF from "./pages/ValidacaoNF";
import ArmazenamentoXML from "./pages/ArmazenamentoXML";
import IntegracaoERP from "./pages/IntegracaoERP";
import SPEDFiscal from "./pages/SPEDFiscal";
import EFDReinf from "./pages/EFDReinf";
import IndicadoresFiscais from "./pages/IndicadoresFiscais";
import Monitoramento from "./pages/Monitoramento";
import AutomacaoRPA from "./pages/AutomacaoRPA";
import ControleLGPD from "./pages/ControleLGPD";
import EmpresasFiliais from "./pages/EmpresasFiliais";
import CertificadosDigitais from "./pages/CertificadosDigitais";
import ParametrosFiscais from "./pages/ParametrosFiscais";
import CadastroProdutos from "./pages/CadastroProdutos";
import CadastroClientesFornecedores from "./pages/CadastroClientesFornecedores";
import CadastroFormasPagamento from "./pages/CadastroFormasPagamento";

// Páginas protegidas (somente admin)
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EmpresaProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/demonstracao" element={<Demonstracao />} />
            <Route path="/demonstracao/confirmacao" element={<DemonstracaoConfirmacao />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-uso" element={<TermosUso />} />

            {/* Rotas protegidas - qualquer usuário autenticado */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            } />
            <Route path="/integrations" element={
              <ProtectedRoute>
                <Integrations />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />

            {/* Rotas de cadastros */}
            <Route path="/cadastros/produtos" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <CadastroProdutos />
              </ProtectedRoute>
            } />
            <Route path="/cadastros/clientes-fornecedores" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <CadastroClientesFornecedores />
              </ProtectedRoute>
            } />
            <Route path="/cadastros/formas-pagamento" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <CadastroFormasPagamento />
              </ProtectedRoute>
            } />

            {/* Rotas protegidas - admin e contador */}
            <Route path="/nfe" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <NFe />
              </ProtectedRoute>
            } />
            <Route path="/nfse" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <NFSe />
              </ProtectedRoute>
            } />
            <Route path="/nfce" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <NFCe />
              </ProtectedRoute>
            } />
            <Route path="/validacao-nf" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <ValidacaoNF />
              </ProtectedRoute>
            } />
            <Route path="/armazenamento-xml" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <ArmazenamentoXML />
              </ProtectedRoute>
            } />
            <Route path="/integracao-erp" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <IntegracaoERP />
              </ProtectedRoute>
            } />
            <Route path="/sped-fiscal" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <SPEDFiscal />
              </ProtectedRoute>
            } />
            <Route path="/efd-reinf" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <EFDReinf />
              </ProtectedRoute>
            } />
            <Route path="/indicadores-fiscais" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <IndicadoresFiscais />
              </ProtectedRoute>
            } />
            <Route path="/monitoramento" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <Monitoramento />
              </ProtectedRoute>
            } />
            <Route path="/automacao-rpa" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <AutomacaoRPA />
              </ProtectedRoute>
            } />
            <Route path="/controle-lgpd" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <ControleLGPD />
              </ProtectedRoute>
            } />
            <Route path="/empresas-filiais" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <EmpresasFiliais />
              </ProtectedRoute>
            } />
            <Route path="/certificados-digitais" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <CertificadosDigitais />
              </ProtectedRoute>
            } />
            <Route path="/parametros-fiscais" element={
              <ProtectedRoute allowedRoles={['admin', 'contador']}>
                <ParametrosFiscais />
              </ProtectedRoute>
            } />

            {/* Rotas protegidas - somente admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']} strictRole>
                <Admin />
              </ProtectedRoute>
            } />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsentWrapper />
        </BrowserRouter>
      </EmpresaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;