import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Tractor, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';

interface RolePickerProps {
  onRoleSelect: (role: UserRole) => void;
}

export const RolePicker: React.FC<RolePickerProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { t } = useTranslation();

  const roles = [
    {
      id: 'buyer' as UserRole,
      title: t('auth.buyer'),
      description: t('auth.buyerDesc'),
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'farmer' as UserRole,
      title: t('auth.farmer'),
      description: t('auth.farmerDesc'),
      icon: Tractor,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">
          {t('auth.roleSelection')}
        </h2>
      </div>

      <div className="space-y-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${role.bgColor}`}>
                  <Icon className={`w-5 h-5 ${role.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{role.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {role.description}
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={() => selectedRole && onRoleSelect(selectedRole)}
        disabled={!selectedRole}
        className="w-full btn-primary"
      >
        {t('auth.getStarted')}
      </Button>
    </div>
  );
};