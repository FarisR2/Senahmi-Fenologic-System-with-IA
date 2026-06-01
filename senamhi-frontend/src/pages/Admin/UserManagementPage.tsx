import React from 'react';
import { useGet } from '../../hooks/useGet';
import type { User } from '../../interfaces';
import './AdminPages.css';


const UserManagementPage: React.FC = () => {
  const { data: users } = useGet<User[]>('/user');

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Supervisa a los usuarios registrados y sus niveles de acceso.</p>
        </div>
      </div>

      <div className="admin-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
