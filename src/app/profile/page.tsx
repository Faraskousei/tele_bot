import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/user/UserProfile';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#e9ecef',
        padding: '20px'
      }}>
        <UserProfile />
      </div>
    </ProtectedRoute>
  );
}
