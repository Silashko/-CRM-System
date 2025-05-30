import React, { useState, useEffect } from "react";
import Tasks from "./Tasks.jsx";

export default function Todo() {
  const [fullList, setFullList] = useState([]);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [filterValue, setFilterValue] = useState({
    all: 0,
    completed: 0,
    inWork: 0,
  });

  async function submittingTasks() {
    if (!inputValue) {
      alert("Пожалуйста, введите название задачи.");
      return;
    }

    if (inputValue.length < 2 || inputValue.length > 64) {
      alert(
        "Название задачи должно содержать от 2 до 64 символов."
      );
      return;
    }
    try {
      const response = await fetch("https://easydev.club/api/v1/todos", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDone: false,
          title: inputValue,
        }),
      });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const newTodo = await response.json();
      setFullList((prevTodos) => [...prevTodos, newTodo]);
      setFilterValue((prevFilterValue) => ({
        ...prevFilterValue,
        all: prevFilterValue.all + 1,
        inWork: prevFilterValue.inWork + 1,
      }));
    } catch (error) {
      setError(error);
    } finally {
      setInputValue("");
    }
  }

  async function fetchTasks() {
    try {
      const response = await fetch("https://easydev.club/api/v1/todos", {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      const resData = await response.json();

      if (!response.ok) {
        throw new Error("не удалось получить задачи");
      }
      setFullList(resData.data);
      setFilterValue(resData.info);
    } catch (error) {
      setError(error);
    }
  }

  async function RemoveTasks(id) {
    await fetch(`https://easydev.club/api/v1/todos/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    });
    setFullList((prevFullList) =>
      prevFullList.filter((data) => data.id !== id)
    );
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  async function updateTodo(id, isDone) {
    try {
      const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTodoTitle,
          isDone: isDone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при обновлении задачи: ${response.status}`);
      }

      setFullList((prevFullList) => {
        return prevFullList.map((data) => {
          if (data.id === id) {
            return { ...data, title: editingTodoTitle };
          } else {
            return data;
          }
        });
      });
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      throw error;
    } finally {
      setEditingTodoTitle("");
      setEditingTodoId(null);
    }
  }

  const handleEditingInputChange = (event) => {
    setEditingTodoTitle(event.target.value);
  };
  const isEditing = (id) => editingTodoId === id;

  const handleEditClick = (data) => {
    setEditingTodoId(data.id);
    setEditingTodoTitle(data.title);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
  };

  const getFilteredTasks = () => {
    if (taskFilter === "all") {
      return fullList;
    } else if (taskFilter === "completed") {
      return fullList.filter((data) => data.isDone);
    } else if (taskFilter === "inWork") {
      return fullList.filter((data) => !data.isDone);
    }
    return fullList;
  };

  const handleFilterChange = (filter) => {
    setTaskFilter(filter);
  };

  const handleToggleDone = async (id, isDone) => {
    await updateTodo(id, isDone);
    fetchTasks();
  };

  return (
    <div>
      <input
        className="inputAddTasks"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Новая задача"
        required
        minlength="2"
        maxlength="64"
      />

      <button
        className="buttonAddTasks"
        type="submit"
        onClick={submittingTasks}
      >
        Добавить
      </button>
      <div className="tabsFilter">
        <button onClick={() => handleFilterChange("all")}>
          Все ({filterValue.all})
        </button>
        <button onClick={() => handleFilterChange("inWork")}>
          В работе ({filterValue.inWork})
        </button>
        <button onClick={() => handleFilterChange("completed")}>
          Завершенные ({filterValue.completed})
        </button>
      </div>
      <Tasks
        data={getFilteredTasks()}
        onAddFilter={fetchTasks}
        onDelete={RemoveTasks}
        onUpdate={updateTodo}
        onChange={handleEditingInputChange}
        value={editingTodoTitle}
        isEditting={isEditing}
        onEdit={handleEditClick}
        onRevers={handleCancelEdit}
        onToggleDone={handleToggleDone}
      />
    </div>
  );
}
