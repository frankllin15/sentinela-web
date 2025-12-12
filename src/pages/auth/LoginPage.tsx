import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Login realizado com sucesso!');
      navigate(ROUTES.HOME);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Email ou senha incorretos';
        toast.error(message);
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-950">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-slate-50">
          SENTINELA
        </CardTitle>
        <CardDescription className="text-center text-slate-400">
          Sistema de Inteligência Policial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu.email@example.com"
                      className="bg-slate-900 text-slate-50 border-slate-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      inputMode="numeric"
                      placeholder="Digite sua senha numérica"
                      className="bg-slate-900 text-slate-50 border-slate-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
