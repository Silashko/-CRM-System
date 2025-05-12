export default function Tasks({ data, onSelectPlace }) {
  console.log(data);
  return (
    <section className="tasks-category ">
      <ul>
        {data.map((data) => (
          <li key={data.id}>
            <h3>{data.title}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
}
