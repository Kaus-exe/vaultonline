import React, { useState } from 'react';
import { loginUser } from '../api/authRepository';

export function LoginModal({ isOpen, onClose, onSuccess }) {
  const [phone, setPhone] = useState('+7 777 000 00 00');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await loginUser(phone, password);
      onSuccess(user);
      onClose();
    } catch {
      setError('Неверный логин или пароль (проверь Spring Boot)');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Вход в VaultOnline</h3>
        <form onSubmit={handleSubmit}>
          <div className="control-group">
            <label>Номер телефона</label>
            <input
              type="text"
              className="text-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Пароль</label>
            <input
              type="password"
              className="text-input"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-green full-width">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}