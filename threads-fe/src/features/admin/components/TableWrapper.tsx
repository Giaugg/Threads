export default function TableWrapper({ children }: any) {
  return (
    <div className="bg-[#111] rounded-xl overflow-hidden">
      <table className="w-full">{children}</table>
    </div>
  );
}