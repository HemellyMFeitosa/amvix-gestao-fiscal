/**
 * Mapeador de erros seguros
 * Converte mensagens de erro internas em mensagens amigáveis para o usuário
 * Evita expor detalhes de implementação como nomes de tabelas, estrutura do banco, etc.
 */

// Mapeamento de códigos de erro PostgreSQL para mensagens seguras
const POSTGRES_ERRORS: Record<string, string> = {
  '23505': 'Este registro já existe no sistema',
  '23503': 'Operação não permitida - há dados relacionados',
  '23502': 'Campo obrigatório não preenchido',
  '23514': 'Valor inválido para este campo',
  '42501': 'Você não tem permissão para esta ação',
  '42P01': 'Recurso não encontrado',
  '22P02': 'Formato de dados inválido',
  '22003': 'Valor fora do limite permitido',
};

// Mapeamento de códigos de erro Supabase Auth
const AUTH_ERRORS: Record<string, string> = {
  'invalid_credentials': 'E-mail ou senha incorretos',
  'email_not_confirmed': 'E-mail não confirmado. Verifique sua caixa de entrada',
  'user_not_found': 'Usuário não encontrado',
  'email_exists': 'Este e-mail já está cadastrado',
  'invalid_email': 'E-mail inválido',
  'weak_password': 'Senha muito fraca. Use pelo menos 8 caracteres',
  'signup_disabled': 'Novos cadastros estão temporariamente desabilitados',
  'user_already_exists': 'Este usuário já está cadastrado',
  'over_request_rate_limit': 'Muitas tentativas. Aguarde alguns minutos',
  'over_email_send_rate_limit': 'Limite de e-mails atingido. Tente novamente mais tarde',
};

// Mapeamento de códigos PostgREST
const POSTGREST_ERRORS: Record<string, string> = {
  'PGRST116': 'Recurso não encontrado',
  'PGRST301': 'Acesso não autorizado',
  'PGRST000': 'Erro de conexão com o servidor',
};

// Mensagens baseadas em patterns de texto
const ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /row-level security/i, message: 'Você não tem permissão para acessar este recurso' },
  { pattern: /unique constraint/i, message: 'Este registro já existe no sistema' },
  { pattern: /foreign key/i, message: 'Operação não permitida - há dados relacionados' },
  { pattern: /not null/i, message: 'Campo obrigatório não preenchido' },
  { pattern: /check constraint/i, message: 'Valor inválido para este campo' },
  { pattern: /network/i, message: 'Erro de conexão. Verifique sua internet' },
  { pattern: /timeout/i, message: 'Servidor demorou para responder. Tente novamente' },
  { pattern: /invalid password/i, message: 'Senha incorreta' },
  { pattern: /invalid email/i, message: 'E-mail inválido' },
  { pattern: /already registered/i, message: 'Este e-mail já está cadastrado' },
  { pattern: /quantidade deve ser maior/i, message: 'A quantidade deve ser maior que zero' },
  { pattern: /valor unitário não pode ser negativo/i, message: 'O valor unitário não pode ser negativo' },
  { pattern: /dados_fiscais não pode ser nulo/i, message: 'Dados fiscais são obrigatórios' },
];

/**
 * Extrai o código de erro de um objeto de erro
 */
const getErrorCode = (error: any): string | null => {
  if (!error) return null;
  
  // Códigos PostgreSQL
  if (error.code) return error.code;
  
  // Códigos PostgREST
  if (error.details?.code) return error.details.code;
  
  // Códigos Auth
  if (error.error_code) return error.error_code;
  if (error.__isAuthError && error.code) return error.code;
  
  // Status HTTP
  if (error.status) return `HTTP_${error.status}`;
  
  return null;
};

/**
 * Verifica se a mensagem de erro corresponde a algum padrão conhecido
 */
const matchErrorPattern = (message: string): string | null => {
  if (!message) return null;
  
  for (const { pattern, message: safeMessage } of ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return safeMessage;
    }
  }
  
  return null;
};

/**
 * Converte um erro em uma mensagem segura para exibição ao usuário
 * @param error - Objeto de erro (pode ser de Supabase, PostgreSQL, Auth, etc.)
 * @returns Mensagem de erro segura para exibição
 */
export const getSafeErrorMessage = (error: any): string => {
  if (!error) return 'Erro desconhecido. Tente novamente.';
  
  // 1. Tentar código de erro específico
  const code = getErrorCode(error);
  if (code) {
    if (POSTGRES_ERRORS[code]) return POSTGRES_ERRORS[code];
    if (AUTH_ERRORS[code]) return AUTH_ERRORS[code];
    if (POSTGREST_ERRORS[code]) return POSTGREST_ERRORS[code];
  }
  
  // 2. Tentar pattern matching na mensagem
  const message = error.message || error.error_description || error.msg || '';
  const patternMatch = matchErrorPattern(message);
  if (patternMatch) return patternMatch;
  
  // 3. Mensagem genérica
  return 'Erro ao processar solicitação. Tente novamente ou contate o suporte.';
};

/**
 * Log de erro seguro - apenas em desenvolvimento
 * @param context - Contexto do erro (nome do componente/hook)
 * @param error - Objeto de erro
 */
export const logError = (context: string, error: any): void => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
};

/**
 * Verifica se um erro é de autenticação/autorização
 */
export const isAuthError = (error: any): boolean => {
  const code = getErrorCode(error);
  const message = error?.message || '';
  
  return (
    code === '42501' ||
    code === 'PGRST301' ||
    AUTH_ERRORS[code || ''] !== undefined ||
    /row-level security|unauthorized|forbidden/i.test(message)
  );
};

/**
 * Verifica se um erro é de validação
 */
export const isValidationError = (error: any): boolean => {
  const code = getErrorCode(error);
  
  return (
    code === '23514' ||
    code === '23502' ||
    code === '22P02' ||
    code === '22003'
  );
};
