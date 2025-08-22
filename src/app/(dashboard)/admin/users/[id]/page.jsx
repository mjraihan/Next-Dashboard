export default async function UserDetailPage({ params }) {
  // Ambil parameter ID dari URL
  const { id } = params;

  // Contoh: fetch data user
  const res = await fetch(`https://dummyjson.com/users/${(await params).id}`);
  const user = await res.json();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Detail User {id}</h1>
      <p>
        <strong>Nama:</strong> {user.firstName} {user.lastName}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}
