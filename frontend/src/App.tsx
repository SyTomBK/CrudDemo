import { useEffect, useState, type FormEvent } from 'react';
import { api, type AppInfo, type Product } from './api';

const input =
  'rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-3 focus:ring-blue-100';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<AppInfo | null>(null);

  const load = () =>
    api.list()
      .then(setProducts)
      .catch((e) => setError(`Không tải được danh sách (${e.message}). Kiểm tra API có đang chạy không.`))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    api.info().then(setInfo).catch(() => {});
  }, []);

  const reset = () => { setName(''); setPrice(''); setEditingId(null); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = { name: name.trim(), price: Number(price) };
      if (editingId === null) await api.create(data);
      else await api.update(editingId, data);
      reset();
      await load();
    } catch (err) {
      setError(`Không lưu được sản phẩm (${(err as Error).message}).`);
    }
  };

  const edit = (p: Product) => { setEditingId(p.id); setName(p.name); setPrice(String(p.price)); };

  const remove = async (p: Product) => {
    if (!confirm(`Xóa "${p.name}"?`)) return;
    try { await api.remove(p.id); if (editingId === p.id) reset(); await load(); }
    catch (err) { setError(`Không xóa được sản phẩm (${(err as Error).message}).`); }
  };

  const isEditing = editingId !== null;
  const commit = info?.version.split('+')[1]?.slice(0, 7);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased">
      <main className="mx-auto max-w-4xl px-5 py-12">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Kho sản phẩm</h1>
          {!loading && <span className="text-slate-500">{products.length} sản phẩm</span>}
        </header>

        <form
          onSubmit={submit}
          className={`mb-4 grid gap-2.5 rounded-xl border bg-white p-4 sm:grid-cols-[1fr_180px_auto] ${
            isEditing ? 'border-blue-600 ring-3 ring-blue-100' : 'border-slate-200'
          }`}
        >
          {isEditing && (
            <p className="text-sm text-blue-600 sm:col-span-3">Đang sửa sản phẩm #{editingId}</p>
          )}
          <input className={input} placeholder="Tên sản phẩm" value={name} required
            onChange={(e) => setName(e.target.value)} />
          <input className={input} placeholder="Giá (₫)" type="number" min="0" value={price} required
            onChange={(e) => setPrice(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit"
              className="flex-1 whitespace-nowrap rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">
              {isEditing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </button>
            {isEditing && (
              <button type="button" onClick={reset}
                className="rounded-md border border-slate-300 px-4 py-2.5 font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900">
                Hủy
              </button>
            )}
          </div>
        </form>

        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</p>
        )}

        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <p className="px-4 py-12 text-center text-slate-500">Đang tải danh sách…</p>
          ) : products.length === 0 ? (
            <p className="px-4 py-12 text-center text-slate-500">
              Chưa có sản phẩm nào. Nhập tên và giá ở ô phía trên để thêm sản phẩm đầu tiên.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                  <th className="w-14 px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Tên</th>
                  <th className="px-4 py-3 text-right font-medium">Giá</th>
                  <th className="px-4 py-3 font-medium">Ngày tạo</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}
                    className={`border-b border-slate-100 last:border-0 ${
                      p.id === editingId ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}>
                    <td className="px-4 py-3.5 tabular-nums text-slate-400">{p.id}</td>
                    <td className="px-4 py-3.5 font-medium">{p.name}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-lg font-bold tabular-nums">
                      {p.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">
                      {new Date(p.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <button onClick={() => edit(p)}
                        className="px-2 py-1 text-slate-500 hover:text-blue-600">Sửa</button>
                      <button onClick={() => remove(p)}
                        className="px-2 py-1 text-slate-500 hover:text-red-600">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {info && (
          <footer className="mt-6 text-sm text-slate-500">
            API đang chạy bản {commit ?? info.version}, môi trường {info.environment}
          </footer>
        )}
      </main>
    </div>
  );
}