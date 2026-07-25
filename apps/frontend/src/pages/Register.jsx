import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'At least 8 characters'),
  phone: z.string().optional(),
});

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const { register: signup } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (data) => {
    try {
      await signup(data);
      toast.success('Account created!');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Signup failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create account</h1>
      <p className="text-sm text-slate-500 mt-1">Join Doctor Prescription AI.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input className="input" {...register('fullName')} />
          {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" {...register('email')} />
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" className="input" {...register('password')} />
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label">Phone (optional)</label>
          <input className="input" {...register('phone')} />
        </div>
        <button className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-5">
        Already have an account? <Link to="/login" className="text-brand-600 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
