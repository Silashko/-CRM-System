

export default function Tasks({
  data,
  onDelete,
  onUpdate,
  value,
  onChange,
  isEditting,
  onEdit,
  onRevers,
}) {
  return (
    <section className="tasks-category ">
      <ul>
        {data.map((data) => (
          <li key={data.id}>
            {isEditting(data.id) ? ( 
              <>
                <input
                  onChange={onChange}
                  value={value}
                />
                <button onClick={() => onUpdate(data.id)}>Сохранить</button>
                <button onClick={onRevers}>Отменить</button>
              </>
            ) : (
              <>
                <h3>{data.title}</h3>
                
                <button onClick={() => onDelete(data.id)}>удалить</button>
                <button onClick={() => onEdit(data)}>Редактировать</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
