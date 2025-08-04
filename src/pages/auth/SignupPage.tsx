import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { User, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SignupForm {
  email: string;
  password: string;
  name: string;
  region: string;
  language: string;
  role: UserRole;
}

export const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { register: registerUser, setRole } = useAuth();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SignupForm>({
    defaultValues: {
      region: 'Hargeisa',
      language: 'en'
    }
  });

  const onSubmit = async (data: SignupForm) => {
    if (!selectedRole) {
      toast.error('Please select your role');
      return;
    }

    setIsLoading(true);
    try {
      // First register with Supabase auth directly
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: selectedRole,
            region: data.region,
            language: data.language,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      const user = {
        id: authData.user!.id,
        email: data.email,
        name: data.name,
        role: selectedRole,
        region: data.region,
        language: data.language,
        createdAt: authData.user!.created_at,
      };
      
      await setRole(selectedRole);
      toast.success('Account created successfully!');
      navigate(`/${selectedRole}`, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'buyer' as UserRole,
      title: 'Buyer',
      description: 'Purchase fresh agricultural products',
      icon: ShoppingCart,
    },
    {
      id: 'farmer' as UserRole,
      title: 'Farmer',
      description: 'Sell your produce directly to buyers',
      icon: User,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="/lovable-uploads/e8911162-0401-434a-9d62-592829f50321.png" 
            alt="e-Beer" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Join the agricultural marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection */}
            <div>
              <Label>Choose your role</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setValue('role', role.id);
                      }}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        selectedRole === role.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-2" />
                      <div className="font-medium text-sm">{role.title}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="mt-1"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="mt-1"
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Select onValueChange={(value) => setValue('region', value)} defaultValue="Hargeisa">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hargeisa">Hargeisa</SelectItem>
                  <SelectItem value="Berbera">Berbera</SelectItem>
                  <SelectItem value="Burao">Burao</SelectItem>
                  <SelectItem value="Borama">Borama</SelectItem>
                  <SelectItem value="Erigavo">Erigavo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !selectedRole}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};