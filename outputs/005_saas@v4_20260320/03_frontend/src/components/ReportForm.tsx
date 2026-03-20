import { useState } from "react";

interface Props {
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function ReportForm({ onSuccess, onError }: Props) {
  const [template, setTemplate] = useState("");
  const [cadence, setCadence] = useState("daily");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!template.trim() || !email.includes("@")) {
      onError("请填写模板名并输入有效邮箱");
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitting(false);
    onSuccess();
  };

  return (
    <section className="neu-card p-4">
      <h2 className="mb-3 text-lg font-semibold">报表计划</h2>
      <div className="grid gap-2">
        <input className="neu-input" placeholder="模板名" value={template} onChange={(event) => setTemplate(event.target.value)} />
        <select className="neu-input" value={cadence} onChange={(event) => setCadence(event.target.value)}>
          <option value="daily">每日</option>
          <option value="weekly">每周</option>
        </select>
        <input className="neu-input" placeholder="接收邮箱" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="button" className="rounded-xl bg-accent-secure px-4 py-2 text-white" onClick={submit} disabled={submitting}>
          {submitting ? "提交中..." : "保存并启用"}
        </button>
      </div>
    </section>
  );
}
