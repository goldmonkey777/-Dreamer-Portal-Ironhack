import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Navbar } from '../components/Navbar';
import { PortalLoader } from '../components/PortalLoader';
import { dreamsService } from '../services/dreams.service';
import { projectsService } from '../services/projects.service';
import { tasksService } from '../services/tasks.service';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [activeTab, setActiveTab] = useState('dreams');
  const [dreams, setDreams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dreamForm, setDreamForm] = useState({
    title: '',
    content: '',
    dreamDate: '',
    moodTags: '',
    lucidityLevel: 3
  });
  const [dreamAttachmentDataUri, setDreamAttachmentDataUri] = useState('');
  const [dreamAttachmentFileName, setDreamAttachmentFileName] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium' });
  const [dreamFilters, setDreamFilters] = useState({ mood: '', lucidity: '' });
  const [taskFilters, setTaskFilters] = useState({ status: '' });
  const [error, setError] = useState('');

  const dreamOptions = useMemo(
    () => dreams.map((dream) => ({ value: dream._id, label: dream.title })),
    [dreams]
  );

  const loadData = async () => {
    setIsLoadingPage(true);
    try {
      const [projectResponse, dreamsResponse, tasksResponse] = await Promise.all([
        projectsService.getById(id),
        dreamsService.listByProject(id, {
          mood: dreamFilters.mood || undefined,
          lucidity: dreamFilters.lucidity || undefined
        }),
        tasksService.listByProject(id, {
          status: taskFilters.status || undefined
        })
      ]);
      setProject(projectResponse.data);
      setDreams(dreamsResponse.data);
      setTasks(tasksResponse.data);
    } finally {
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    loadData().catch(() => {
      setError('Não foi possível carregar os dados do ciclo');
    });
  }, [id, dreamFilters.mood, dreamFilters.lucidity, taskFilters.status]);

  const submitDream = async (event) => {
    event.preventDefault();
    try {
      const createdDream = await dreamsService.create(id, {
        ...dreamForm,
        moodTags: dreamForm.moodTags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      });

      if (dreamAttachmentDataUri && createdDream?.data?._id) {
        await dreamsService.uploadAttachment(createdDream.data._id, dreamAttachmentDataUri);
      }

      setDreamForm({ title: '', content: '', dreamDate: '', moodTags: '', lucidityLevel: 3 });
      setDreamAttachmentDataUri('');
      setDreamAttachmentFileName('');
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível criar o sonho');
    }
  };

  const handleDreamAttachmentChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setDreamAttachmentDataUri('');
      setDreamAttachmentFileName('');
      return;
    }

    try {
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
        reader.readAsDataURL(file);
      });

      setDreamAttachmentDataUri(dataUri);
      setDreamAttachmentFileName(file.name);
    } catch {
      setError('Não foi possível processar o arquivo selecionado');
    }
  };

  const submitTask = async (event) => {
    event.preventDefault();
    try {
      await tasksService.create(id, taskForm);
      setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', relatedDream: '' });
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível criar a ação');
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      await tasksService.update(task._id, { status: newStatus });
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível atualizar a ação');
    }
  };

  const handleEditDream = async (dream) => {
    const title = window.prompt('Editar título do sonho:', dream.title);
    if (!title) {
      return;
    }
    const content = window.prompt('Editar conteúdo do sonho:', dream.content);
    if (!content) {
      return;
    }

    try {
      await dreamsService.update(dream._id, {
        title,
        content,
        dreamDate: dream.dreamDate,
        moodTags: dream.moodTags,
        lucidityLevel: dream.lucidityLevel
      });
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível editar o sonho');
    }
  };

  const handleDeleteDream = async (dreamId) => {
    const confirmed = window.confirm('Arquivar este sonho?');
    if (!confirmed) {
      return;
    }

    try {
      await dreamsService.archive(dreamId);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível arquivar o sonho');
    }
  };

  const handleAnalyzeDream = async (dreamId) => {
    try {
      await dreamsService.analyze(dreamId);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível solicitar análise do sonho');
    }
  };

  const handleEditTask = async (task) => {
    const title = window.prompt('Editar título da ação:', task.title);
    if (!title) {
      return;
    }

    const description = window.prompt('Editar descrição da ação:', task.description || '');
    try {
      await tasksService.update(task._id, {
        title,
        description: description || '',
        status: task.status,
        priority: task.priority,
        relatedDream: task.relatedDream || null
      });
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível editar a ação');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Arquivar esta ação?');
    if (!confirmed) {
      return;
    }

    try {
      await tasksService.archive(taskId);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível arquivar a ação');
    }
  };

  if (isLoadingPage && !project) {
    return <PortalLoader label="Abrindo seu ciclo..." />;
  }

  if (!project) {
    return (
      <main className="app-shell">
        <Navbar />
        <p className="page-subtitle">Ciclo não encontrado. <Link to="/dashboard">Voltar</Link></p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Navbar />
      <p>
        <Link to="/dashboard">← Voltar para os Ciclos</Link>
      </p>
      <h1 className="page-title">{project.title}</h1>
      <p className="page-subtitle">{project.description}</p>

      <section className="dp-tabs">
        <button
          type="button"
          className={`dp-tab ${activeTab === 'dreams' ? 'active' : ''}`}
          onClick={() => setActiveTab('dreams')}
        >
          Sonhos
        </button>
        <button
          type="button"
          className={`dp-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Ações
        </button>
      </section>

      {activeTab === 'dreams' ? (
        <section className="mystic-panel" style={{ marginBottom: 14 }}>
          <h2>Registros de Sonho</h2>
          <section className="dp-row" style={{ marginBottom: 12 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Filtrar por tag de humor</span>
              <input
                className="dp-input"
                placeholder="Ex: calma"
                value={dreamFilters.mood}
                onChange={(event) =>
                  setDreamFilters((prev) => ({ ...prev, mood: event.target.value }))
                }
              />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Filtrar por lucidez</span>
              <select
                className="dp-select"
                value={dreamFilters.lucidity}
                onChange={(event) =>
                  setDreamFilters((prev) => ({ ...prev, lucidity: event.target.value }))
                }
              >
                <option value="">Todos</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>
          </section>

          <form onSubmit={submitDream} className="dp-form" style={{ maxWidth: 580 }}>
            <input
              className="dp-input"
              placeholder="Título do sonho"
              value={dreamForm.title}
              onChange={(event) => setDreamForm({ ...dreamForm, title: event.target.value })}
              required
            />
            <textarea
              className="dp-textarea"
              placeholder="Descreva o sonho com detalhes simbólicos"
              value={dreamForm.content}
              onChange={(event) => setDreamForm({ ...dreamForm, content: event.target.value })}
              required
            />
            <input
              className="dp-input"
              type="date"
              value={dreamForm.dreamDate}
              onChange={(event) => setDreamForm({ ...dreamForm, dreamDate: event.target.value })}
              required
            />
            <input
              className="dp-input"
              placeholder="Tags de humor (separadas por vírgula)"
              value={dreamForm.moodTags}
              onChange={(event) => setDreamForm({ ...dreamForm, moodTags: event.target.value })}
            />
            <select
              className="dp-select"
              value={dreamForm.lucidityLevel}
              onChange={(event) =>
                setDreamForm({ ...dreamForm, lucidityLevel: Number(event.target.value) })
              }
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>

            <label style={{ display: 'grid', gap: 4 }}>
              <span>Imagem do sonho (opcional)</span>
              <input className="dp-input" type="file" accept="image/*" onChange={handleDreamAttachmentChange} />
            </label>
            {dreamAttachmentFileName ? <small>Arquivo selecionado: {dreamAttachmentFileName}</small> : null}

            <button type="submit" className="dp-btn">Salvar sonho</button>
          </form>

          {!isLoadingPage && dreams.length === 0 ? (
            <EmptyState
              title="Nenhum sonho registrado"
              description="Registre seu primeiro sonho neste ciclo para começar a leitura simbólica."
            />
          ) : null}
          <ul className="dp-list" style={{ marginTop: 12 }}>
            {dreams.map((dream) => (
              <li key={dream._id} className="dp-list-item">
                <strong>{dream.title}</strong> · {new Date(dream.dreamDate).toLocaleDateString()} · Lucidez{' '}
                {dream.lucidityLevel}{' '}
                <button type="button" className="dp-btn dp-btn-secondary" onClick={() => handleEditDream(dream)}>
                  Editar
                </button>{' '}
                <button type="button" className="dp-btn dp-btn-secondary" onClick={() => handleDeleteDream(dream._id)}>
                  Arquivar
                </button>
                {' '}
                <button
                  type="button"
                  className="dp-btn dp-btn-secondary"
                  onClick={() => handleAnalyzeDream(dream._id)}
                  disabled={dream.analysis?.status === 'pending' || dream.analysis?.status === 'processing'}
                >
                  {dream.analysis?.status === 'pending' || dream.analysis?.status === 'processing'
                    ? 'Analisando...'
                    : 'Reanalisar'}
                </button>
                <div style={{ marginTop: 6 }}>
                  <small>
                    Status da interpretação:{' '}
                    {dream.analysis?.status === 'processed'
                      ? 'processada'
                      : dream.analysis?.status === 'failed'
                        ? 'falhou'
                        : dream.analysis?.status === 'processing'
                          ? 'em processamento'
                          : 'pendente'}
                  </small>
                </div>
                {Array.isArray(dream.attachments) && dream.attachments.length > 0 ? (
                  <div>
                    <small>Anexos:</small>{' '}
                    {dream.attachments.map((attachment) => (
                      <a
                        key={attachment.url}
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginRight: 8 }}
                      >
                        Ver imagem
                      </a>
                    ))}
                  </div>
                ) : null}

                {dream.analysis?.status === 'processed' ? (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      border: '1px solid rgba(196, 180, 255, 0.35)',
                      borderRadius: 8,
                      display: 'grid',
                      gap: 6,
                      background: 'rgba(20, 27, 58, 0.7)'
                    }}
                  >
                    <strong>Leitura simbólica</strong>
                    <p style={{ margin: 0 }}>{dream.analysis?.summary || 'Sem resumo disponível.'}</p>
                    {Array.isArray(dream.analysis?.symbols) && dream.analysis.symbols.length > 0 ? (
                      <small>Símbolos: {dream.analysis.symbols.join(', ')}</small>
                    ) : null}
                    {Array.isArray(dream.analysis?.archetypes) && dream.analysis.archetypes.length > 0 ? (
                      <small>Arquétipos: {dream.analysis.archetypes.join(', ')}</small>
                    ) : null}
                    {dream.analysis?.suggestedAction ? (
                      <small>Ação sugerida: {dream.analysis.suggestedAction}</small>
                    ) : null}
                    <small style={{ opacity: 0.8 }}>
                      {dream.analysis?.disclaimer ||
                        'Esta interpretação é simbólica e reflexiva. Não substitui aconselhamento profissional.'}
                    </small>
                  </div>
                ) : null}

                {dream.analysis?.status === 'failed' ? (
                  <small className="dp-error" style={{ display: 'block', marginTop: 6 }}>
                    Falha na análise: {dream.analysis?.error || 'erro desconhecido'}
                  </small>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mystic-panel">
          <h2>Ações Derivadas</h2>
          <section className="dp-row" style={{ marginBottom: 12 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Filtrar por status</span>
              <select
                className="dp-select"
                value={taskFilters.status}
                onChange={(event) =>
                  setTaskFilters((prev) => ({ ...prev, status: event.target.value }))
                }
              >
                <option value="">Todos</option>
                <option value="todo">A fazer</option>
                <option value="doing">Em andamento</option>
                <option value="done">Concluída</option>
              </select>
            </label>
          </section>

          <form onSubmit={submitTask} className="dp-form" style={{ maxWidth: 580 }}>
            <input
              className="dp-input"
              placeholder="Título da ação"
              value={taskForm.title}
              onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
              required
            />
            <textarea
              className="dp-textarea"
              placeholder="Descrição da ação"
              value={taskForm.description}
              onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
            />
            <select
              className="dp-select"
              value={taskForm.status}
              onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}
            >
              <option value="todo">A fazer</option>
              <option value="doing">Em andamento</option>
              <option value="done">Concluída</option>
            </select>
            <select
              className="dp-select"
              value={taskForm.priority}
              onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
            <select
              className="dp-select"
              value={taskForm.relatedDream || ''}
              onChange={(event) => setTaskForm({ ...taskForm, relatedDream: event.target.value })}
            >
              <option value="">Sem sonho relacionado</option>
              {dreamOptions.map((dream) => (
                <option key={dream.value} value={dream.value}>
                  {dream.label}
                </option>
              ))}
            </select>
            <button type="submit" className="dp-btn">Criar ação</button>
          </form>

          {!isLoadingPage && tasks.length === 0 ? (
            <EmptyState
              title="Nenhuma ação criada"
              description="Transforme um insight em uma ação prática para iniciar seu movimento real."
            />
          ) : null}
          <ul className="dp-list" style={{ marginTop: 12 }}>
            {tasks.map((task) => (
              <li key={task._id} className="dp-list-item">
                <strong>{task.title}</strong> ·{' '}
                {task.status === 'todo'
                  ? 'A fazer'
                  : task.status === 'doing'
                    ? 'Em andamento'
                    : 'Concluída'}{' '}
                ·{' '}
                {task.priority === 'low' ? 'Baixa' : task.priority === 'high' ? 'Alta' : 'Média'}{' '}
                <button type="button" className="dp-btn dp-btn-secondary" onClick={() => toggleTaskStatus(task)}>
                  Marcar/Desmarcar conclusão
                </button>{' '}
                <button type="button" className="dp-btn dp-btn-secondary" onClick={() => handleEditTask(task)}>
                  Editar
                </button>{' '}
                <button type="button" className="dp-btn dp-btn-secondary" onClick={() => handleDeleteTask(task._id)}>
                  Arquivar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error ? <p className="dp-error">{error}</p> : null}
    </main>
  );
};
