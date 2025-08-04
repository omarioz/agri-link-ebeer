import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { RolePicker } from './RolePicker';

interface AuthFormData {
  email: string;
  password: string;
  name: string;
  region: string;
  language: string;
}

const authSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  name: yup.string().required('Name is required'),
  region: yup.string().required('Region is required'),
  language: yup.string().required('Language is required'),
});

export const AuthWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSignIn, setIsSignIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { login, register, setRole } = useAuth();
  const { t, i18n } = useTranslation();

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      language: 'en',
      region: 'Hargeisa'
    }
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isSignIn) {
        await login(data.email, data.password);
      } else {
        await register({
          email: data.email,
          name: data.name,
          role: selectedRole || 'buyer',
          region: data.region,
          language: data.language,
        });
      }
      
      if (selectedRole) {
        await setRole(selectedRole);
        i18n.changeLanguage(data.language);
        navigate(`/${selectedRole}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleRoleComplete = async (role: UserRole) => {
    setSelectedRole(role);
    const form = document.getElementById('auth-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {step > 1 && (
          <button onClick={prevStep} className="p-2 hover:bg-muted rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 flex justify-center">
          <img 
            src="/lovable-uploads/e8911162-0401-434a-9d62-592829f50321.png" 
            alt="e-Beer" 
            className="h-8 w-auto"
          />
        </div>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Progress */}
      <div className="px-4 mb-6">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4">
        <form id="auth-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {t('auth.welcome')}
                </h1>
                <p className="text-muted-foreground">
                  {t('auth.subtitle')}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={() => { setIsSignIn(true); nextStep(); }}
                  className="w-full btn-primary"
                >
                  {t('auth.signIn')}
                </Button>
                <Button
                  type="button"
                  onClick={() => { setIsSignIn(false); nextStep(); }}
                  className="w-full btn-secondary"
                >
                  {t('auth.createAccount')}
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerField('email')}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerField('password')}
                  className="mt-1"
                />
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={nextStep}
                className="w-full btn-primary"
              >
                {t('common.next')} <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 3 && !isSignIn && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('auth.name')}</Label>
                <Input
                  id="name"
                  {...registerField('name')}
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="region">{t('auth.region')}</Label>
                <select
                  id="region"
                  {...registerField('region')}
                  className="mt-1 w-full p-2 border border-input rounded-lg bg-background"
                >
                  <option value="Hargeisa">Hargeisa</option>
                  <option value="Berbera">Berbera</option>
                  <option value="Burao">Burao</option>
                  <option value="Borama">Borama</option>
                  <option value="Erigavo">Erigavo</option>
                </select>
              </div>

              <div>
                <Label htmlFor="language">{t('auth.language')}</Label>
                <select
                  id="language"
                  {...registerField('language')}
                  className="mt-1 w-full p-2 border border-input rounded-lg bg-background"
                >
                  <option value="en">English</option>
                  <option value="so">Somali</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <Button
                type="button"
                onClick={nextStep}
                className="w-full btn-primary"
              >
                {t('common.next')} <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {(step === 4 || (step === 3 && isSignIn)) && (
            <RolePicker onRoleSelect={handleRoleComplete} />
          )}
        </form>
      </div>
    </div>
  );
};