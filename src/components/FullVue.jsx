import Input from "./Input.jsx";
import ListTasks from "./AllTasks.jsx";

export default function FullVue() {
  return (
    <>
      <Input />
      <div>
        <h2>Все</h2>
        <ListTasks />
        <h2>В работе (Х)</h2>
        <h2>Выполнено (Х) </h2>
      </div>
    </>
  );
}
