const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const pool = require("./db");

//middleware
app.use(express.json());
app.use(cors());

app.use(morgan("tiny"));

// Routes

// Create a todo

app.post("/todos", async (req, res) => {
  try {
    const { todo } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (todo) VALUES ($1) RETURNING *",
      [todo]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Get all todo

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");

    res.json(allTodos.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// Get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await pool.query("SELECT * FROM todo  WHERE id = $1", [id]);

    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { todo } = req.body;

    const updateTodo = await pool.query(
      "UPDATE todo SET todo = $1 WHERE id = $2",
      [id, todo]
    );

    res.json(updateTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);

    res.json("Todi was deleted");
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
