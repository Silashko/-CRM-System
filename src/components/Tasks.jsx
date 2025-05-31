import editIcon from "../icons/edit.svg";
import deleteIcon from "../icons/delete.svg";

export default function Tasks({
  data,
  onDelete,
  onUpdate,
  value,
  onChange,
  isEditting,
  onEdit,
  onRevers,
  onToggleDone,
}) {
  return (
    <section className="tasks-category ">
      <ul>
        {data.map((data) => (
          <li key={data.id}>
            {isEditting(data.id) ? (
              <>
                <input onChange={onChange} value={value} />
                <button className="btn" onClick={() => onUpdate(data.id)}>
                  Сохранить
                </button>
                <button className="btn" onClick={onRevers}>
                  Отменить
                </button>
              </>
            ) : (
              <>
                <label className="fullCheckbox">
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={data.isDone}
                    onChange={(event) =>
                      onToggleDone(data.id, event.target.checked)
                    }
                  />
                  <span className="checkmark"></span>
                </label>

                <h3>{data.title}</h3>
                <button className="edit-icon" onClick={() => onEdit(data)}>
                  <img src={editIcon} />
                </button>
                <button
                  className="delete-icon"
                  onClick={() => onDelete(data.id)}
                >
                  <img src={deleteIcon} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
