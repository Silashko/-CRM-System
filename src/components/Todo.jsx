import { useState, useEffect } from "react";

import Tasks from "./Tasks.jsx";

export default function Todo() {
  const [fullList, setFullList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null); 

  const [editingTodoTitle, setEditingTodoTitle] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const submittingTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://easydev.club/api/v1/todos", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDone: true,
          title: inputValue,
        }),
      });
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const newTodo = await response.json();
      setFullList((prevTodos) => [...prevTodos, newTodo]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setInputValue("");
    }
  };

  async function fetchTasks() {
    try {
      const response = await fetch(
        "https://easydev.club/api/v1/todos?filter={status}",
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      const resData = await response.json();

      if (!response.ok) {
        throw new Error("не удалось получить задачи");
      }

      setFullList(resData.data);
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

  if (isLoading) {
    return <div>Идет загрузка...</div>;
  }
  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  const updateTodo = async (id) => {
    setIsEdit(true);
    try {
      const response = await fetch(`https://easydev.club/api/v1/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTodoTitle,
          isDone: false,
        }),
      });

      setFullList((prevFullList) => {
        return prevFullList.map((data) => {
          if (data.id === id) {
            return { ...data, title: editingTodoTitle };
          } else {
            return data;
          }
        });
      });

      if (!response.ok) {
        throw new Error(`Ошибка при обновлении задачи: ${response.status}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      throw error;
    } finally {
      setEditingTodoTitle("");
      setIsEdit(false);
    }
  };
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

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Новая задача"
      />

      <button type="submit" onClick={submittingTasks}>
        Добавить
      </button>
      <Tasks
        data={fullList}
        onDelete={RemoveTasks}
        onUpdate={updateTodo}
        onChange={handleEditingInputChange}
        value={editingTodoTitle}
        isEditting={isEditing}
        onEdit={handleEditClick}
        onRevers={handleCancelEdit}
      />
    </div>
  );
}
