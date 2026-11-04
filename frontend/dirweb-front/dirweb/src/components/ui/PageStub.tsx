export default function PageStub({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-xl bg-brand-soft p-8 text-brand">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="opacity-80">{hint}</p>
    </div>
  )
}
