import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";
import amvixLogo from "@/assets/amvix-logo.png";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Logo AMVIX */}
      <div className="flex items-center">
        <img 
          src={amvixLogo} 
          alt="AMVIX" 
          className="h-8 w-auto"
        />
      </div>

      {/* Ações da Direita */}
      <div className="flex items-center gap-3">
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
};
