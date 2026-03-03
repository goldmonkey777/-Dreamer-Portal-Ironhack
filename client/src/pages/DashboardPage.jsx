import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { projectsService } from '../services/projects.service';

export const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [form, setForm] = useState({ title: '', description: '', tags: '' });
  const [error, setError] = useState('');

  const loadProjects = async () => {
    const response = await projectsService.list({
      search: filters.search || undefined,
      status: filters.status || undefined
    });
    setProjects(response.data);
  };

  useEffect(() => {
    loadProjects().catch(() => setError('Não foi possível carregar os ciclos'));
  }, [filters.search, filters.status]);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await projectsService.create({
        title: form.title,
        description: form.description,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      });
      setForm({ title: '', description: '', tags: '' });
      await loadProjects();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível criar o ciclo');
    }
  };

  const handleEditCycle = async (cycle) => {
    const title = window.prompt('Novo título do ciclo:', cycle.title);
    if (!title) {
      return;
    }

    const description = window.prompt('Nova descrição do ciclo:', cycle.description || '');
    try {
      await projectsService.update(cycle._id, { title, description: description || '' });
      await loadProjects();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível atualizar o ciclo');
    }
  };

  const handleArchiveCycle = async (cycleId) => {
    const confirmed = window.confirm('Arquivar este ciclo?');
    if (!confirmed) {
      return;
    }

    try {
      await projectsService.archive(cycleId);
      await loadProjects();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível arquivar o ciclo');
    }
  };

  const handleReactivateCycle = async (cycleId) => {
    try {
      await projectsService.update(cycleId, { status: 'active' });
      await loadProjects();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível reativar o ciclo');
    }
  };

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '0 12px' }}>
      <Navbar />
      <h1>DreamerPortal · Ciclos de Sonhos</h1>

      <section style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Buscar ciclo</span>
          <input
            placeholder="Ex: Autoconhecimento Março"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
          />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="">Todos</option>
            <option value="active">Ativo</option>
            <option value="archived">Arquivado</option>
          </select>
        </label>
      </section>

      <section style={{ marginBottom: 16 }}>
        <form onSubmit={handleCreateProject} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
          <h2>Novo Ciclo</h2>
          <p style={{ margin: 0 }}>
            Um ciclo é o espaço onde seus sonhos e ações ficam organizados.
          </p>
          <label style={{ display: 'grid', gap: 4 }}>
            <span>Título do ciclo *</span>
            <input
              placeholder="Ex: Ciclo de Clareza"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </label>
          <small>Nome curto que representa o foco deste ciclo.</small>

          <label style={{ display: 'grid', gap: 4 }}>
            <span>Descrição</span>
            <textarea
              placeholder="Ex: Quero entender padrões dos meus sonhos sobre carreira e relações."
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <small>Resumo opcional da intenção desse ciclo.</small>

          <label style={{ display: 'grid', gap: 4 }}>
            <span>Tags (separadas por vírgula)</span>
            <input
              placeholder="Ex: carreira, ansiedade, família"
              value={form.tags}
              onChange={(event) => setForm({ ...form, tags: event.target.value })}
            />
          </label>
          <small>Use palavras-chave para filtrar depois.</small>

          <button type="submit">Criar ciclo</button>
        </form>
      </section>

      <section>
        <h2>Seus Ciclos</h2>
        {projects.length === 0 ? <p>Você ainda não criou ciclos.</p> : null}
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link to={`/projects/${project._id}`}>{project.title}</Link> ·{' '}
              {project.status === 'active' ? 'Ativo' : 'Arquivado'} ·{' '}
              <button type="button" onClick={() => handleEditCycle(project)}>
                Editar
              </button>{' '}
              {project.status === 'active' ? (
                <button type="button" onClick={() => handleArchiveCycle(project._id)}>
                  Arquivar
                </button>
              ) : (
                <button type="button" onClick={() => handleReactivateCycle(project._id)}>
                  Reativar
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
    </main>
  );
};
