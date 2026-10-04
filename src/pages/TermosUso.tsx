import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import amvixLogo from "@/assets/amvix-logo.png";

const TermosUso = () => {
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Termos de Uso</h1>
            <p className="text-muted-foreground">AMVIX Sistemas</p>
          </div>
        </div>

        <p className="text-center text-muted-foreground mb-12">
          Última atualização: 15 de janeiro de 2025
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* 1. Aceitação */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar o AMVIX, você concorda com estes Termos de Uso. Se não concordar com
              qualquer parte destes termos, não utilize o sistema.
            </p>
          </section>

          {/* 2. Descrição do Serviço */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground mb-3">
              O AMVIX é um sistema de gestão empresarial que oferece:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Emissão de notas fiscais (NF-e, NFS-e, NFC-e)</li>
              <li>• Gestão contábil e fiscal</li>
              <li>• Integração com ERPs</li>
              <li>• Automação de processos (RPA)</li>
              <li>• Relatórios e análises</li>
              <li>• Armazenamento de XML</li>
              <li>• Validação de notas fiscais</li>
              <li>• Indicadores fiscais e monitoramento</li>
            </ul>
          </section>

          {/* 3. Cadastro e Conta */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">3. Cadastro e Conta</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Você deve fornecer informações verdadeiras e atualizadas</li>
              <li>• É responsável pela segurança da sua senha</li>
              <li>• Deve ter 18 anos ou mais para criar uma conta</li>
              <li>• Uma pessoa pode ter apenas uma conta ativa</li>
              <li>• Deve notificar imediatamente sobre uso não autorizado</li>
            </ul>
          </section>

          {/* 4. Uso Aceitável */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">4. Uso Aceitável</h2>
            <p className="text-muted-foreground mb-3">Você concorda em NÃO:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Violar leis ou regulamentos aplicáveis</li>
              <li>• Usar o sistema para atividades fraudulentas</li>
              <li>• Compartilhar sua conta com outras pessoas</li>
              <li>• Tentar hackear ou comprometer a segurança</li>
              <li>• Fazer engenharia reversa do software</li>
              <li>• Usar o sistema para enviar spam ou conteúdo malicioso</li>
              <li>• Interferir com o funcionamento normal do sistema</li>
              <li>• Acessar dados de outros usuários sem autorização</li>
            </ul>
          </section>

          {/* 5. Propriedade Intelectual */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">5. Propriedade Intelectual</h2>
            <p className="text-muted-foreground">
              O AMVIX e todo seu conteúdo (código, design, textos, imagens, logos) são de
              propriedade exclusiva da AMVIX Sistemas Ltda. Você recebe uma licença limitada,
              não-exclusiva e revogável de uso, mas não adquire nenhum direito de propriedade sobre
              o software.
            </p>
          </section>

          {/* 6. Pagamentos */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">6. Pagamentos e Assinaturas</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Planos disponíveis conforme tabela de preços publicada</li>
              <li>• Opções de pagamento mensal ou anual</li>
              <li>• Renovação automática ao final do período</li>
              <li>• Cancelamento a qualquer momento através do sistema</li>
              <li>• Não há reembolso proporcional em caso de cancelamento</li>
              <li>• Preços sujeitos a alteração com aviso prévio de 30 dias</li>
            </ul>
          </section>

          {/* 7. Limitação de Responsabilidade */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-muted-foreground mb-3">O AMVIX não se responsabiliza por:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Perda de dados causada por falha do usuário</li>
              <li>• Problemas de conexão com a internet</li>
              <li>• Uso incorreto ou inadequado do sistema</li>
              <li>• Decisões empresariais tomadas com base nos relatórios</li>
              <li>• Danos indiretos ou consequenciais</li>
              <li>• Interrupções temporárias para manutenção</li>
            </ul>
          </section>

          {/* 8. Disponibilidade */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">8. Disponibilidade do Serviço</h2>
            <p className="text-muted-foreground">
              Embora nos esforcemos para manter o sistema disponível 24/7, podem ocorrer
              interrupções para manutenção programada ou emergencial. Notificaremos os usuários
              sobre manutenções programadas com antecedência quando possível.
            </p>
          </section>

          {/* 9. Rescisão */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">9. Rescisão</h2>
            <p className="text-muted-foreground mb-3">
              Podemos suspender ou encerrar sua conta se:
            </p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li>• Violar estes termos de uso</li>
              <li>• Não pagar as taxas devidas</li>
              <li>• Usar o sistema de forma fraudulenta</li>
              <li>• Causar danos ao sistema ou outros usuários</li>
            </ul>
            <p className="text-muted-foreground">
              Você pode cancelar sua conta a qualquer momento através das configurações do sistema.
              Após o cancelamento, seus dados serão mantidos conforme nossa Política de Privacidade
              e obrigações legais.
            </p>
          </section>

          {/* 10. Modificações */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">10. Modificações dos Termos</h2>
            <p className="text-muted-foreground">
              Reservamos o direito de modificar estes termos a qualquer momento. Você será
              notificado sobre mudanças significativas por e-mail ou através de aviso no sistema. O
              uso continuado após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* 11. Dados e Backup */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">11. Dados e Backup</h2>
            <p className="text-muted-foreground">
              Realizamos backups regulares dos dados, mas recomendamos que você também mantenha
              cópias locais de informações críticas. Não garantimos a recuperação de dados em todas
              as situações e não nos responsabilizamos por perda de dados causada por eventos fora
              do nosso controle.
            </p>
          </section>

          {/* 12. Lei Aplicável */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">12. Lei Aplicável</h2>
            <p className="text-muted-foreground">
              Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer
              disputa será resolvida no foro da Comarca de Manaus/AM, com exclusão de qualquer
              outro, por mais privilegiado que seja.
            </p>
          </section>

          {/* 13. Contato */}
          <section className="bg-primary/10 border border-primary/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">13. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Para dúvidas sobre estes termos de uso, entre em contato:
            </p>
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

export default TermosUso;
