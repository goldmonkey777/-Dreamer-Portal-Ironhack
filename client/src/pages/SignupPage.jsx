import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (requestError) {
      const details = requestError.response?.data?.details;
      const firstDetailMessage = Array.isArray(details) ? details[0]?.message : '';
      setError(firstDetailMessage || requestError.response?.data?.message || 'Não foi possível criar a conta');
    }
  };

  return (
    <main>
      <h1>Criar conta no DreamerPortal</h1>
      <p>Comece seu ciclo registrando sonhos, significados e ações.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input
          placeholder="Seu nome"
          minLength={2}
          maxLength={80}
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          placeholder="Seu e-mail"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          placeholder="Crie uma senha"
          type="password"
          minLength={8}
          maxLength={120}
          required
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button type="submit">Criar conta</button>
      </form>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  );
};
