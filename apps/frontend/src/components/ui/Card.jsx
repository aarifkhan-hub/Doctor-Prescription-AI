import clsx from 'clsx';
export default function Card({ className, children, ...rest }) {
  return <div className={clsx('card p-5', className)} {...rest}>{children}</div>;
}
