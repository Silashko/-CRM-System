import { useState, useEffect } from "react";

import Tasks from "./Tasks.jsx";

export default function ListTasks({ onSelectPlace }) {
  const [fullList, setfullList] = useState([]);

  useEffect(() => {
    fetch("https://easydev.club/api/v1/todos?filter={status}", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((resData) => {
        setfullList(resData.data);
      });
  }, []);

  return <Tasks data={fullList} />;
}
