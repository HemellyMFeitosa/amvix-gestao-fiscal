import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type AppRole = 'admin' | 'contador' | 'cliente';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** 
   * Roles permitidas para acessar esta rota.
   * Se não especificado, qualquer usuário autenticado pode acessar.
   * admin tem acesso a todas as rotas.
   */
  allowedRoles?: AppRole[];
  /**
   * Se true, requer role específica (não permite hierarquia).
   * Se false (padrão), admin pode acessar qualquer rota.
   */
  strictRole?: boolean;
}

/**
 * Componente para proteger rotas que requerem autenticação e/ou roles específicas.
 * 
 * Uso:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <Admin />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute allowedRoles={['admin', 'contador']}>
 *   <NFe />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  strictRole = false 
}: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Exibe loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!user) {
    // Salva a rota atual para redirecionar após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se há roles específicas requeridas
  if (allowedRoles && allowedRoles.length > 0 && role) {
    // Admin sempre tem acesso (a menos que strictRole seja true)
    const isAdmin = role === 'admin';
    const hasAllowedRole = allowedRoles.includes(role);
    
    if (strictRole) {
      // Modo estrito: só a role exata tem acesso
      if (!hasAllowedRole) {
        return <Navigate to="/dashboard" replace />;
      }
    } else {
      // Modo hierárquico: admin tem acesso a tudo
      if (!isAdmin && !hasAllowedRole) {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  // Se requer role mas usuário ainda não tem role carregada, aguarda
  if (allowedRoles && allowedRoles.length > 0 && !role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;