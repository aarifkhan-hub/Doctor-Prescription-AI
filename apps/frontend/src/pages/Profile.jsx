import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, changePassword } from '../services/authService';

export default function Profile() {
  const { user, setUser } = useAuth();
  const profile = useForm({ defaultValues: { fullName: user?.fullName, phone: user?.phone, preferredLanguage: user?.preferredLanguage } });
  const pw = useForm();

  const onProfile = async (data) => {
    try {
      const u = await updateProfile(data);
      setUser(u);
      toast.success('Profile updated');
    } catch { toast.error('Failed'); }
  };

  const onPassword = async (data) => {
    try {
      await changePassword(data);
      toast.success('Password updated');
      pw.reset();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Profile</h1>

      <form onSubmit={profile.handleSubmit(onProfile)} className="card p-5 space-y-3">
        <h2 className="font-semibold">Personal info</h2>
        <div>
          <label className="label">Email</label>
          <input className="input" value={user?.email || ''} disabled />
        </div>
        <div>
          <label className="label">Full name</label>
          <input className="input" {...profile.register('fullName')} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" {...profile.register('phone')} />
        </div>
        <div>
          <label className="label">Preferred language</label>
          <select className="input" {...profile.register('preferredLanguage')}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <button className="btn-primary">Save changes</button>
      </form>

      <form onSubmit={pw.handleSubmit(onPassword)} className="card p-5 space-y-3">
        <h2 className="font-semibold">Change password</h2>
        <div>
          <label className="label">Current password</label>
          <input type="password" className="input" {...pw.register('currentPassword')} />
        </div>
        <div>
          <label className="label">New password</label>
          <input type="password" className="input" {...pw.register('newPassword')} />
        </div>
        <button className="btn-primary">Update password</button>
      </form>
    </div>
  );
}
