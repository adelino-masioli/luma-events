import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Luma Events',
  description: 'Entre na sua conta Luma Events',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/cadastro" className="font-medium text-primary hover:text-primary/90">
              cadastre-se gratuitamente
            </Link>
          </p>
        </div>

        <LoginForm />

        <div className="text-sm text-center">
          <Link href="/esqueci-senha" className="font-medium text-primary hover:text-primary/90">
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </div>
  );
}