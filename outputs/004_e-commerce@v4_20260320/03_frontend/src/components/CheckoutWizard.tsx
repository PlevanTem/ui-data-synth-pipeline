import { useMemo } from "react";
import { z } from "zod";
import type { CheckoutForm, ValidationErrors } from "../types";

const schema = z.object({
  name: z.string().min(2, "请输入收件人姓名"),
  email: z.string().email("请输入有效邮箱"),
  phone: z.string().min(7, "请输入有效手机号"),
  address: z.string().min(8, "请输入完整地址"),
});

interface Props {
  form: CheckoutForm;
  errors: ValidationErrors;
  isSubmitting: boolean;
  onFormChange: (next: CheckoutForm) => void;
  onErrorsChange: (next: ValidationErrors) => void;
  onSubmit: () => void;
}

export function CheckoutWizard({
  form,
  errors,
  isSubmitting,
  onFormChange,
  onErrorsChange,
  onSubmit,
}: Props) {
  const canSubmit = useMemo(() => !Object.values(errors).some(Boolean), [errors]);

  const validate = (next: CheckoutForm) => {
    const result = schema.safeParse(next);
    if (result.success) {
      onErrorsChange({});
      return;
    }
    const mapped: ValidationErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ValidationErrors;
      mapped[key] = issue.message;
    }
    onErrorsChange(mapped);
  };

  const updateField = (key: keyof CheckoutForm, value: string) => {
    const next = { ...form, [key]: value };
    onFormChange(next);
    validate(next);
  };

  return (
    <section className="glass block" id="checkout">
      <h2>无障碍结账</h2>
      <div className="form-grid">
        <label>
          收件人
          <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          {errors.name && <span role="alert" className="error">{errors.name}</span>}
        </label>
        <label>
          邮箱
          <input value={form.email} onChange={(event) => updateField("email", event.target.value)} />
          {errors.email && <span role="alert" className="error">{errors.email}</span>}
        </label>
        <label>
          手机
          <input inputMode="numeric" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
          {errors.phone && <span role="alert" className="error">{errors.phone}</span>}
        </label>
        <label>
          地址
          <textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} />
          {errors.address && <span role="alert" className="error">{errors.address}</span>}
        </label>
      </div>
      <div className="pay-row">
        <button onClick={() => onFormChange({ ...form, paymentMethod: "card" })} aria-pressed={form.paymentMethod === "card"}>信用卡</button>
        <button onClick={() => onFormChange({ ...form, paymentMethod: "paypal" })} aria-pressed={form.paymentMethod === "paypal"}>PayPal</button>
      </div>
      <button disabled={!canSubmit || isSubmitting} onClick={onSubmit}>
        {isSubmitting ? "提交中..." : "提交订单"}
      </button>
    </section>
  );
}
