import { useState, useEffect } from "react";

export default function Todo() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");

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
      const resData = await response.json();
      setData(resData);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setInputValue("");
    }
  };
  useEffect(() => {
    submittingTasks();
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

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button type="submit" onClick={submittingTasks}>
        Отправить
      </button>
    </div>
  );
}
