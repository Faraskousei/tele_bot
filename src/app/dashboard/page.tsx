'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();

  return (
    <ProtectedRoute>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#e9ecef',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px'
          }}>
            Dashboard Bot Platform
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Status Bot</h3>
              <p style={{ color: '#28a745', fontWeight: 'bold' }}>🟢 Online</p>
              <p>Bot aktif dan siap menerima pesan</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#17a2b8', marginBottom: '10px' }}>Total Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>1,234</p>
              <p>Pengguna terdaftar</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#ffc107', marginBottom: '10px' }}>Messages Today</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>5,678</p>
              <p>Pesan hari ini</p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Informasi Pengguna</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Nama:</strong> {userProfile?.displayName}
              </div>
              <div>
                <strong>Chat ID:</strong> {userProfile?.telegramChatId || 'Belum diatur'}
              </div>
              <div>
                <strong>Username:</strong> {userProfile?.telegramUsername || 'Belum diatur'}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/" 
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              Kelola Fitur Bot
            </a>
            <a 
              href="/profile" 
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              Edit Profil
            </a>
            <a 
              href="/test-bot" 
              style={{
                padding: '12px 24px',
                backgroundColor: '#17a2b8',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              Test Bot
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}