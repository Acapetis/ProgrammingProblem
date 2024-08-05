const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let todos = [];
let nextId = 1;

// pagination helper
function paginate(array, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return array.slice(startIndex, endIndex);
}

app.get('/todos', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const paginatedTodos = paginate(todos, parseInt(page), parseInt(limit));
  res.json(paginatedTodos);
});

app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ message: 'Todo item not found' });
  }
  res.json(todo);
});

app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  const newTodo = { id: nextId++, title, description, completed: false, dateAdded: new Date() };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { title, description } = req.body;
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ message: 'Todo item not found' });
  }
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  todo.title = title;
  todo.description = description;
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo item not found' });
  }
  todos.splice(todoIndex, 1);
  res.status(204).end();
});

app.patch('/todos/:id/completed', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ message: 'Todo item not found' });
  }
  todo.completed = true;
  res.json(todo);
});

app.patch('/todos/:id/incomplete', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ message: 'Todo item not found' });
  }
  todo.completed = false;
  res.json(todo);
});

app.get('/todos/filter', (req, res) => {
  const { date, page = 1, limit = 10 } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'Date query parameter is required' });
  }
  const filteredTodos = todos.filter(todo => {
    const todoDate = todo.dateAdded.toISOString().split('T')[0];
    return todoDate === date;
  });
  const paginatedTodos = paginate(filteredTodos, parseInt(page), parseInt(limit));
  res.json(paginatedTodos);
});

app.get('/todos/search', (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }
  const lowerCaseQuery = query.toLowerCase();
  const searchedTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(lowerCaseQuery) || 
    todo.description.toLowerCase().includes(lowerCaseQuery)
  );
  const paginatedTodos = paginate(searchedTodos, parseInt(page), parseInt(limit));
  res.json(paginatedTodos);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`To-do list app listening at http://localhost:${port}`);
  });
} else {
  module.exports = app;
}
