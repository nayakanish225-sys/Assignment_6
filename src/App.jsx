import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

/* ---------------- SAMPLE TASKS ---------------- */

const initialTasks = [
  {
    id: 1,
    header: "Complete React Assignment",
    description: "Build the Task Manager application using React Router.",
    priority: "High",
    category: "Academic",
    raisedDate: "2026-09-20 10:30 AM",
    dueDate: "2026-08-28",
    status: "Pending",
  },
  {
    id: 2,
    header: "Buy Groceries",
    description: "Purchase vegetables, fruits and other household items.",
    priority: "Medium",
    category: "Personal",
    raisedDate: "2026-09-20 12:00 PM",
    dueDate: "2026-08-28",
    status: "Raised",
  },
  {
    id: 3,
    header: "Submit Project Report",
    description: "Submit the final project report to the department.",
    priority: "High",
    category: "Academic",
    raisedDate: "2026-09-18 09:00 AM",
    dueDate: "2026-08-28",
    status: "Closed",
  },
];

/* ---------------- APP ---------------- */

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  function login() {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  }

  return (
    <>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login login={login} />
            )
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout logout={logout}>
                <Dashboard tasks={tasks} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout logout={logout}>
                <Tasks tasks={tasks} setTasks={setTasks} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-task"
          element={
            <ProtectedRoute>
              <Layout logout={logout}>
                <AddTask tasks={tasks} setTasks={setTasks} />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* DYNAMIC ROUTE */}
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <Layout logout={logout}>
                <TaskDetails tasks={tasks} setTasks={setTasks} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/completed"
          element={
            <ProtectedRoute>
              <Layout logout={logout}>
                <CompletedTasks tasks={tasks} />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

/* ---------------- LOGIN ---------------- */

function Login({ login }) {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    login();
    navigate("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">✓</div>

        <h1>TaskFlow</h1>

        <p>Task Management System</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            required
          />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <small>Demo Login — enter any username and password</small>
      </div>
    </div>
  );
}

/* ---------------- LAYOUT ---------------- */

function Layout({ children, logout }) {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span>✓</span> TaskFlow
        </div>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/add-task">Add Task</Link>
          <Link to="/completed">Completed</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="container">{children}</main>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const raised = tasks.filter((t) => t.status === "Raised").length;
  const completed = tasks.filter((t) => t.status === "Closed").length;

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your tasks efficiently</p>
        </div>

        <Link to="/add-task" className="primary-btn">
          + Add Task
        </Link>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div>
            <span>Total Tasks</span>
            <strong>{total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div>
            <span>Raised</span>
            <strong>{raised}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">⚡</div>
          <div>
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>
        </div>
      </div>

      <section className="section-card">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks">View All →</Link>
        </div>

        <TaskTable tasks={tasks.slice(0, 5)} />
      </section>
    </>
  );
}

/* ---------------- TASKS ---------------- */

function Tasks({ tasks, setTasks }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All" || task.status === filter;

    const matchesSearch =
      task.header.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  function deleteTask(id) {
    if (window.confirm("Delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Tasks</h1>
          <p>View and manage all your tasks</p>
        </div>

        <Link to="/add-task" className="primary-btn">
          + Add Task
        </Link>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Raised">Raised</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <section className="section-card">
        <TaskTable
          tasks={filteredTasks}
          deleteTask={deleteTask}
        />
      </section>
    </>
  );
}

/* ---------------- TASK TABLE ---------------- */

function TaskTable({ tasks, deleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <h3>No tasks found</h3>
        <p>Try changing your filter or add a new task.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <Link
                  to={`/tasks/${task.id}`}
                  className="task-link"
                >
                  {task.header}
                </Link>

                <small>{task.description}</small>
              </td>

              <td>
                <span
                  className={`badge priority-${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
              </td>

              <td>{task.category}</td>

              <td>{task.dueDate}</td>

              <td>
                <span
                  className={`badge status-${task.status.toLowerCase()}`}
                >
                  {task.status}
                </span>
              </td>

              <td>
                <Link
                  to={`/tasks/${task.id}`}
                  className="view-btn"
                >
                  View
                </Link>

                {deleteTask && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- ADD TASK ---------------- */

function AddTask({ tasks, setTasks }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    header: "",
    description: "",
    priority: "Medium",
    category: "Academic",
    dueDate: "2026-08-28",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      ...form,
      raisedDate: new Date().toLocaleString(),
      status: "Raised",
    };

    setTasks([...tasks, newTask]);

    navigate("/tasks");
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Add New Task</h1>
          <p>Create a new task for your task manager</p>
        </div>
      </div>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Header</label>
            <input
              type="text"
              name="header"
              placeholder="Enter task header"
              value={form.header}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Task Description</label>
            <textarea
              name="description"
              placeholder="Enter task description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Academic</option>
                <option>Personal</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/tasks")}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Create Task
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

/* ---------------- TASK DETAILS ---------------- */

function TaskDetails({ tasks, setTasks }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = tasks.find((t) => t.id.toString() === id);

  if (!task) {
    return (
      <div className="empty">
        <h2>Task Not Found</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/tasks")}
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  function changeStatus(status) {
    setTasks(
      tasks.map((t) =>
        t.id === task.id ? { ...t, status } : t
      )
    );
  }

  function deleteTask() {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== task.id));
      navigate("/tasks");
    }
  }

  return (
    <>
      <button
        className="back-btn"
        onClick={() => navigate("/tasks")}
      >
        ← Back to Tasks
      </button>

      <section className="details-card">
        <div className="details-top">
          <div>
            <span
              className={`badge priority-${task.priority.toLowerCase()}`}
            >
              {task.priority} Priority
            </span>

            <h1>{task.header}</h1>

            <p>{task.description}</p>
          </div>

          <span
            className={`big-status status-${task.status.toLowerCase()}`}
          >
            {task.status}
          </span>
        </div>

        <div className="details-grid">
          <div>
            <label>Category</label>
            <strong>{task.category}</strong>
          </div>

          <div>
            <label>Raised Date & Time</label>
            <strong>{task.raisedDate}</strong>
          </div>

          <div>
            <label>Due Date</label>
            <strong>{task.dueDate}</strong>
          </div>

          <div>
            <label>Task ID</label>
            <strong>#{task.id}</strong>
          </div>
        </div>

        <div className="status-actions">
          <h3>Update Status</h3>

          <button onClick={() => changeStatus("Raised")}>
            Raised
          </button>

          <button onClick={() => changeStatus("Pending")}>
            Pending
          </button>

          <button
            className="complete-btn"
            onClick={() => changeStatus("Closed")}
          >
            ✓ Mark Completed
          </button>

          <button className="delete-large" onClick={deleteTask}>
            Delete Task
          </button>
        </div>
      </section>
    </>
  );
}

/* ---------------- COMPLETED ---------------- */

function CompletedTasks({ tasks }) {
  const completed = tasks.filter(
    (task) => task.status === "Closed"
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Completed Tasks</h1>
          <p>Tasks that have been completed</p>
        </div>
      </div>

      <section className="section-card">
        <TaskTable tasks={completed} />
      </section>
    </>
  );
}

export default App;