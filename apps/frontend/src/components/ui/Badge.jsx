import clsx from 'clsx';
const map = {
  UPLOADED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  PROCESSING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  DONE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  FAILED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};
export default function Badge({ status }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', map[status] || map.UPLOADED)}>
      {status}
    </span>
  );
}
