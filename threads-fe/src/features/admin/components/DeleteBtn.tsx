export default function DeleteBtn({ onClick }: any) {
  return (
    <button onClick={onClick} className="text-red-400">
      Delete
    </button>
  );
}