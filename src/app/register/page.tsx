import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e9ecef',
      padding: '20px'
    }}>
      <RegisterForm />
    </div>
  );
}
