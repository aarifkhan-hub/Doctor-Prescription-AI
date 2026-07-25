import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Languages } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50 dark:from-slate-950 dark:to-slate-900">
      <header className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" className="w-8 h-8" alt="logo" />
          <span className="font-bold">Doctor Prescription AI</span>
        </div>
        <div className="flex gap-2">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Understand every <span className="text-brand-600">prescription</span> in seconds
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Upload a photo of your handwritten prescription. Our AI extracts medicines, dosage, timing and duration —
          and explains everything in simple English and Hindi.
        </motion.p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link to="/register" className="btn-primary text-base px-6 py-3">Try it free</Link>
          <Link to="/login" className="btn-outline text-base px-6 py-3">Sign in</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        <Feature icon={<Zap />}       title="Fast"        desc="Get structured results in under 10 seconds." />
        <Feature icon={<Languages />} title="Bilingual"   desc="Explanations in English and simple Hindi." />
        <Feature icon={<ShieldCheck />} title="Secure"    desc="Encrypted storage. Your data is yours." />
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="card p-6">
      <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
    </div>
  );
}
