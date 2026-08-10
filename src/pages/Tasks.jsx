import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', priority: 'medium' });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/tasks', { title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Could not update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Could not delete task');
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/tasks/${id}`, editData);
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-dark">Your Tasks</h1>
          <button
            onClick={handleLogout}
            className="bg-dark text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition"
          >
            Log out
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form
          onSubmit={handleCreate}
          className="mb-8 p-4 rounded-2xl border border-dark/10"
        >
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green mb-3"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green mb-3"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green mb-3 bg-white"
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="bg-green text-dark font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {loading ? (
          <p className="text-dark/50">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-dark/50">No tasks yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) =>
              editingId === task._id ? (
                <li key={task._id} className="p-4 rounded-2xl border border-dark/20">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green mb-2"
                  />
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green mb-2"
                  />
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-dark/20 focus:outline-none focus:ring-2 focus:ring-green mb-3 bg-white"
                  >
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(task._id)}
                      className="bg-green text-dark font-semibold px-4 py-1.5 rounded-lg text-sm hover:opacity-90 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-dark text-white font-medium px-4 py-1.5 rounded-lg text-sm hover:opacity-90 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              ) : (
                <li
                  key={task._id}
                  className="flex items-start justify-between p-4 rounded-2xl border border-dark/10"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                      className="mt-1 accent-green"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium ${
                            task.completed ? 'line-through text-dark/40' : 'text-dark'
                          }`}
                        >
                          {task.title}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-600'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-dark/5 text-dark/50'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-dark/50">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="bg-green text-dark text-sm font-medium px-3 py-1 rounded-lg hover:opacity-90 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-dark text-white text-sm font-medium px-3 py-1 rounded-lg hover:opacity-90 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Tasks;