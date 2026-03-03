import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { dreamsService } from '../services/dreams.service';
import { projectsService } from '../services/projects.service';
import { tasksService } from '../services/tasks.service';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
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

  if (!project) {
    return (
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '0 12px' }}>
        <Navbar />
        <p>Ciclo não encontrado. <Link to="/dashboard">Voltar</Link></p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '0 12px' }}>
      <Navbar />
      <p>
        <Link to="/dashboard">← Voltar para os Ciclos</Link>
      </p>
      <h1>{project.title}</h1>
      <p>{project.description}</p>

      <section style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => setActiveTab('dreams')}>
          Sonhos
        </button>
        <button type="button" onClick={() => setActiveTab('tasks')}>
          Ações
        </button>
      </section>

      {activeTab === 'dreams' ? (
        <section>
          <h2>Registros de Sonho</h2>
          <section style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Filtrar por tag de humor</span>
              <input
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

          <form onSubmit={submitDream} style={{ display: 'grid', gap: 8, maxWidth: 580 }}>
            <input
              placeholder="Título do sonho"
              value={dreamForm.title}
              onChange={(event) => setDreamForm({ ...dreamForm, title: event.target.value })}
              required
            />
            <textarea
              placeholder="Descreva o sonho com detalhes simbólicos"
              value={dreamForm.content}
              onChange={(event) => setDreamForm({ ...dreamForm, content: event.target.value })}
              required
            />
            <input
              type="date"
              value={dreamForm.dreamDate}
              onChange={(event) => setDreamForm({ ...dreamForm, dreamDate: event.target.value })}
              required
            />
            <input
              placeholder="Tags de humor (separadas por vírgula)"
              value={dreamForm.moodTags}
              onChange={(event) => setDreamForm({ ...dreamForm, moodTags: event.target.value })}
            />
            <select
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
              <input type="file" accept="image/*" onChange={handleDreamAttachmentChange} />
            </label>
            {dreamAttachmentFileName ? <small>Arquivo selecionado: {dreamAttachmentFileName}</small> : null}

            <button type="submit">Salvar sonho</button>
          </form>

          <ul>
            {dreams.map((dream) => (
              <li key={dream._id}>
                <strong>{dream.title}</strong> · {new Date(dream.dreamDate).toLocaleDateString()} · Lucidez{' '}
                {dream.lucidityLevel}{' '}
                <button type="button" onClick={() => handleEditDream(dream)}>
                  Editar
                </button>{' '}
                <button type="button" onClick={() => handleDeleteDream(dream._id)}>
                  Arquivar
                </button>
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
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <h2>Ações Derivadas</h2>
          <section style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Filtrar por status</span>
              <select
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

          <form onSubmit={submitTask} style={{ display: 'grid', gap: 8, maxWidth: 580 }}>
            <input
              placeholder="Título da ação"
              value={taskForm.title}
              onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
              required
            />
            <textarea
              placeholder="Descrição da ação"
              value={taskForm.description}
              onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
            />
            <select
              value={taskForm.status}
              onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}
            >
              <option value="todo">A fazer</option>
              <option value="doing">Em andamento</option>
              <option value="done">Concluída</option>
            </select>
            <select
              value={taskForm.priority}
              onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
            <select
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
            <button type="submit">Criar ação</button>
          </form>

          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> ·{' '}
                {task.status === 'todo'
                  ? 'A fazer'
                  : task.status === 'doing'
                    ? 'Em andamento'
                    : 'Concluída'}{' '}
                ·{' '}
                {task.priority === 'low' ? 'Baixa' : task.priority === 'high' ? 'Alta' : 'Média'}{' '}
                <button type="button" onClick={() => toggleTaskStatus(task)}>
                  Marcar/Desmarcar conclusão
                </button>{' '}
                <button type="button" onClick={() => handleEditTask(task)}>
                  Editar
                </button>{' '}
                <button type="button" onClick={() => handleDeleteTask(task._id)}>
                  Arquivar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
    </main>
  );
};
