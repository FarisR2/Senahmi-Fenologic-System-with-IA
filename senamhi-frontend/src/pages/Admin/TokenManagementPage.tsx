import React from 'react';
import { useGet } from '../../hooks/useGet';
import { usePost } from '../../hooks/usePost';
import './AdminPages.css';

interface InvitationToken {
  id: number;
  token: string;
  isUsed: boolean;
  createdAt: string;
  usedBy: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}

const TokenManagementPage: React.FC = () => {
  const { data: tokens, refetch } = useGet<InvitationToken[]>('/invitation-token');
  const { post, loading } = usePost('/invitation-token');

  const handleGenerateToken = async () => {
    await post({});
    refetch();
  };


  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Gestión de Tokens de Invitación</h1>
          <p>Genera y administra los códigos de acceso para nuevos usuarios.</p>
        </div>
        <button 
          className="generate-btn" 
          onClick={handleGenerateToken}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Generar Nuevo Token'}
        </button>
      </div>

      <div className="admin-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Estado</th>
              <th>Creado el</th>
              <th>Usado por</th>
            </tr>
          </thead>
          <tbody>
            {tokens?.map((token) => (
              <tr key={token.id}>
                <td className="token-cell"><code>{token.token}</code></td>
                <td>
                  <span className={`status-badge ${token.isUsed ? 'used' : 'active'}`}>
                    {token.isUsed ? 'Utilizado' : 'Activo'}
                  </span>
                </td>
                <td>{new Date(token.createdAt).toLocaleDateString()}</td>
                <td>
                  {token.usedBy 
                    ? `${token.usedBy.firstName} ${token.usedBy.lastName} (${token.usedBy.email})`
                    : '-'}
                </td>
              </tr>
            ))}
            {(!tokens || tokens.length === 0) && (
              <tr>
                <td colSpan={4} className="empty-row">No hay tokens generados aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenManagementPage;
