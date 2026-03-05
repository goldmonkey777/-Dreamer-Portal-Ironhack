import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!consentAccepted) {
      setError('Você precisa aceitar o consentimento para continuar');
      return;
    }

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
    <main className="auth-layout">
      <section className="auth-card">
        <h1>Criar conta no DreamerPortal</h1>
        <p>Comece seu ciclo registrando sonhos, significados e ações.</p>
        <form onSubmit={handleSubmit} className="dp-form">
          <input
            className="dp-input"
          placeholder="Seu nome"
          minLength={2}
          maxLength={80}
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
          <input
            className="dp-input"
          placeholder="Seu e-mail"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
          <input
            className="dp-input"
          placeholder="Crie uma senha"
          type="password"
          minLength={8}
          maxLength={120}
          required
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
          <label className="dp-checkline">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(event) => setConsentAccepted(event.target.checked)}
            />
            <span>
              Concordo que sonhos são dados sensíveis e que as interpretações da IA são simbólicas, não diagnósticos.
            </span>
          </label>
          <button type="submit" className="dp-btn">Criar conta</button>
        </form>
        {error ? <p className="dp-error">{error}</p> : null}
        <p>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
};
