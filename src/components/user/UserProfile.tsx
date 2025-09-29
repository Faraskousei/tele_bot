'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function UserProfile() {
  const { user, userProfile, updateProfile, logout } = useAuth();
  const [telegramChatId, setTelegramChatId] = useState(userProfile?.telegramChatId || '');
  const [telegramUsername, setTelegramUsername] = useState(userProfile?.telegramUsername || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      await updateProfile({
        telegramChatId: telegramChatId.trim(),
        telegramUsername: telegramUsername.trim()
      });
      setMessage('Profil berhasil diperbarui!');
    } catch (error) {
      setMessage('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Profil Pengguna
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#555', marginBottom: '10px' }}>Informasi Akun</h3>
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Nama:</strong> {userProfile?.displayName}</p>
          <p><strong>Admin:</strong> {userProfile?.isAdmin ? 'Ya' : 'Tidak'}</p>
          <p><strong>Bergabung:</strong> {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('id-ID') : '-'}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#555', marginBottom: '10px' }}>Konfigurasi Telegram</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '500',
            color: '#555'
          }}>
            Chat ID Telegram:
          </label>
          <input
            type="text"
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
            placeholder="Contoh: 123456789"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          <small style={{ color: '#666' }}>
            Chat ID bisa didapatkan dengan mengirim pesan ke bot @Backup_indBot
          </small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '500',
            color: '#555'
          }}>
            Username Telegram (opsional):
          </label>
          <input
            type="text"
            value={telegramUsername}
            onChange={(e) => setTelegramUsername(e.target.value)}
            placeholder="Contoh: @username"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {message && (
          <div style={{
            backgroundColor: message.includes('berhasil') ? '#d4edda' : '#f8d7da',
            color: message.includes('berhasil') ? '#155724' : '#721c24',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: `1px solid ${message.includes('berhasil') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </div>

      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #eee'
      }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
