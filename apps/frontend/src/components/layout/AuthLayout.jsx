import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <Link to="/" className="text-2xl font-bold">Doctor Prescription AI</Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold leading-tight">Read every prescription. Understand every medicine.</h2>
          <p className="mt-3 text-white/80">Handwritten prescriptions decoded by AI, explained in simple English &amp; Hindi.</p>
        </motion.div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} DPRAI</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
