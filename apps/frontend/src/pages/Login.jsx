import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Required'),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success('Welcome back!');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="text-sm text-slate-500 mt-1">Enter your credentials to continue.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
        </div>
        <button className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-5">
        No account? <Link to="/register" className="text-brand-600 font-medium">Create one</Link>
      </p>
    </div>
  );
}
