import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import amvixLogo from "@/assets/amvix-logo.png";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <img src={amvixLogo} alt="AMVIX Logo" className="h-10" />
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Política de Privacidade</h1>
            <p className="text-muted-foreground">AMVIX Sistemas</p>
          </div>
        </div>

        <p className="text-center text-muted-foreground mb-12">
          Última atualização: 15 de janeiro de 2025
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* 1. Introdução */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              A AMVIX ("nós", "nosso" ou "nossa") está comprometida com a proteção da privacidade e
              dos dados pessoais dos nossos usuários. Esta Política de Privacidade descreve como
              coletamos, usamos, armazenamos e protegemos suas informações em conformidade com a Lei
              Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          {/* 2. Definições */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">2. Definições</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Dados Pessoais:</strong> informação relacionada a
                pessoa natural identificada ou identificável
              </li>
              <li>
                <strong className="text-foreground">Titular:</strong> pessoa natural a quem se referem
                os dados
              </li>
              <li>
                <strong className="text-foreground">Controlador:</strong> AMVIX - responsável pelas
                decisões sobre tratamento de dados
              </li>
              <li>
                <strong className="text-foreground">Tratamento:</strong> toda operação realizada com
                dados pessoais
              </li>
            </ul>
          </section>

          {/* 3. Dados que Coletamos */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">3. Dados que Coletamos</h2>
            
            <h3 className="text-xl font-semibold mb-3">3.1 Dados fornecidos por você:</h3>
            <ul className="space-y-1 text-muted-foreground mb-4">
              <li>• Nome completo</li>
              <li>• E-mail</li>
              <li>• Telefone</li>
              <li>• CPF/CNPJ</li>
              <li>• Endereço</li>
              <li>• Dados da empresa</li>
              <li>• Informações fiscais e contábeis</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 Dados coletados automaticamente:</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Endereço IP</li>
              <li>• Tipo de navegador</li>
              <li>• Páginas visitadas</li>
              <li>• Data e hora de acesso</li>
              <li>• Cookies e tecnologias similares</li>
            </ul>
          </section>

          {/* 4. Como Usamos Seus Dados */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">4. Como Usamos Seus Dados</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Fornecer e manter nossos serviços</li>
              <li>• Processar transações e emitir notas fiscais</li>
              <li>• Enviar comunicações importantes</li>
              <li>• Melhorar nossos serviços</li>
              <li>• Cumprir obrigações legais</li>
              <li>• Prevenir fraudes e garantir segurança</li>
              <li>• Análises e estatísticas</li>
            </ul>
          </section>

          {/* 5. Base Legal */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">5. Base Legal para Tratamento</h2>
            <p className="text-muted-foreground mb-3">Tratamos seus dados com base em:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Consentimento do titular</li>
              <li>• Cumprimento de obrigação legal</li>
              <li>• Execução de contrato</li>
              <li>• Exercício regular de direitos</li>
              <li>• Legítimo interesse</li>
            </ul>
          </section>

          {/* 6. Compartilhamento */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">6. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground mb-3">Podemos compartilhar seus dados com:</p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li>• Prestadores de serviços (hospedagem, e-mail, etc.)</li>
              <li>• Autoridades governamentais (quando exigido por lei)</li>
              <li>• Parceiros comerciais (com seu consentimento)</li>
            </ul>
            <p className="text-foreground font-semibold">
              Não vendemos seus dados pessoais a terceiros.
            </p>
          </section>

          {/* 7. Segurança */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">7. Segurança dos Dados</h2>
            <p className="text-muted-foreground mb-3">
              Implementamos medidas técnicas e organizacionais:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Criptografia SSL/TLS</li>
              <li>• Controles de acesso</li>
              <li>• Monitoramento contínuo</li>
              <li>• Backups regulares</li>
              <li>• Treinamento de equipe</li>
            </ul>
          </section>

          {/* 8. Seus Direitos */}
          <section className="bg-card border border-primary/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">8. Seus Direitos (LGPD)</h2>
            <p className="text-muted-foreground mb-3">Você tem direito a:</p>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li>• Confirmação da existência de tratamento</li>
              <li>• Acesso aos dados</li>
              <li>• Correção de dados incompletos/inexatos</li>
              <li>• Anonimização, bloqueio ou eliminação</li>
              <li>• Portabilidade dos dados</li>
              <li>• Revogação do consentimento</li>
              <li>• Informação sobre compartilhamento</li>
              <li>• Oposição ao tratamento</li>
            </ul>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Para exercer seus direitos, entre em contato:</p>
              <p className="text-sm">📧 E-mail: privacidade@amvix.com.br</p>
              <p className="text-sm">📞 Telefone: +55 (48) 3344-6001</p>
            </div>
          </section>

          {/* 9. Retenção */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">9. Retenção de Dados</h2>
            <p className="text-muted-foreground mb-3">Mantemos seus dados enquanto:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Sua conta estiver ativa</li>
              <li>• Necessário para prestação de serviços</li>
              <li>• Exigido por lei (ex: dados fiscais - 5 anos)</li>
            </ul>
          </section>

          {/* 10. Cookies */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">10. Cookies</h2>
            <p className="text-muted-foreground mb-3">Utilizamos cookies para:</p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li>• Manter sua sessão</li>
              <li>• Lembrar preferências</li>
              <li>• Análise de uso</li>
              <li>• Melhorar experiência</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Você pode gerenciar cookies nas configurações do sistema.
            </p>
          </section>

          {/* 11. Alterações */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">11. Alterações nesta Política</h2>
            <p className="text-muted-foreground">
              Podemos atualizar esta política periodicamente. Notificaremos sobre alterações
              significativas via e-mail ou aviso no sistema.
            </p>
          </section>

          {/* 12. DPO */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              12. Encarregado de Dados (DPO)
            </h2>
            <div className="space-y-1 text-muted-foreground">
              <p><strong className="text-foreground">Nome:</strong> [Nome do DPO]</p>
              <p><strong className="text-foreground">E-mail:</strong> dpo@amvix.com.br</p>
              <p><strong className="text-foreground">Telefone:</strong> +55 (48) 3344-6001</p>
            </div>
          </section>

          {/* 13. Lei Aplicável */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">13. Lei Aplicável e Foro</h2>
            <p className="text-muted-foreground">
              Esta política é regida pelas leis do Brasil.
              <br />
              Foro: Comarca de Manaus/AM
            </p>
          </section>

          {/* 14. Contato */}
          <section className="bg-primary/10 border border-primary/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">14. Contato</h2>
            <p className="text-muted-foreground mb-4">Para dúvidas sobre esta política:</p>
            <div className="space-y-2">
              <p className="font-bold text-foreground">AMVIX Sistemas Ltda</p>
              <p className="text-sm">📧 E-mail: comercial@amvix.com.br</p>
              <p className="text-sm">📞 Telefone: +55 (48) 3344-6001</p>
              <p className="text-sm">💬 WhatsApp: +55 (48) 3199-2580</p>
              <p className="text-sm mt-4">📍 Endereços:</p>
              <p className="text-sm ml-4">Manaus - AM</p>
              <p className="text-sm ml-4">São Paulo - SP</p>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <Link to="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o início
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PoliticaPrivacidade;
