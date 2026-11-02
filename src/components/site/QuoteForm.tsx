import { Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { business } from "@/data/business";
import { serviceInterestOptions } from "@/data/services";
import { isEmail, isUkPhone } from "@/lib/validation";
import { getLeadSource } from "@/lib/tracking";
import { PhoneLink } from "./ContactLinks";

type Props = {
  /** Identifies the form in the enquiry email, e.g. "Homepage hero". */
  name: string;
  title?: string;
  intro?: string;
  submitLabel: string;
  /** "card": white card (over the hero). "dark": fields on a charcoal section. */
  variant: "card" | "dark";
  withEmail?: boolean;
  /** Dropdown label and options; defaults to the full service list. Pass an empty list for no dropdown. */
  selectLabel?: string | undefined;
  selectOptions?: string[];
  messageLabel?: string;
  /** Extra detail added to the email, e.g. which service page it came from. */
  context?: string;
  id?: string;
};

type Fields = {
  name: string;
  phone: string;
  email: string;
  choice: string;
  message: string;
  botcheck: boolean;
};

export function QuoteForm({
  name,
  title,
  intro,
  submitLabel,
  variant,
  withEmail = false,
  selectLabel: selectLabelProp,
  selectOptions = serviceInterestOptions,
  messageLabel = "Brief message",
  context,
  id = "quote",
}: Props) {
  const selectLabel = selectLabelProp ?? "Service interest";
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [f, setF] = useState<Fields>({
    name: "",
    phone: "",
    email: "",
    choice: "",
    message: "",
    botcheck: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const errors = {
    name: f.name.trim() ? "" : "Please enter your name.",
    phone: !f.phone.trim()
      ? "Please enter your phone number."
      : isUkPhone(f.phone)
        ? ""
        : "Please enter a valid UK phone number.",
    email:
      withEmail && f.email.trim() && !isEmail(f.email) ? "Please enter a valid email address." : "",
  };
  const err = (k: keyof typeof errors) => (touched[k] ? errors[k] : "");
  const set =
    (k: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((s) => ({ ...s, [k]: e.target.value }));
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    const firstBad = (["name", "phone", "email"] as const).find((k) => errors[k]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    if (f.botcheck) return;
    if (!business.formKeys.client) {
      // No Web3Forms key yet: say so rather than pretending it sent.
      setSendError(true);
      return;
    }

    setSending(true);
    setSendError(false);
    const body: Record<string, string | boolean> = {
      access_key: business.formKeys.client,
      subject: `New website enquiry — ${business.name} — ${name}`,
      from_name: `${business.name} website`,
      form_name: name,
      page_url: window.location.href,
      botcheck: f.botcheck,
      Name: f.name.trim(),
      Phone: f.phone.trim(),
    };
    if (withEmail && f.email.trim()) {
      body["Email"] = f.email.trim();
      body["replyto"] = f.email.trim();
    }
    if (context) body["Page"] = context;
    if (f.choice) body[selectLabel] = f.choice;
    if (f.message.trim()) body["Message"] = f.message.trim();
    for (const [k, v] of Object.entries(getLeadSource())) body[k] = v;

    const post = (payload: object) =>
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
    if (business.formKeys.agency)
      post({ ...body, access_key: business.formKeys.agency }).catch(() => {});

    try {
      const res = await post(body);
      const data = await res.json().catch(() => null);
      if (data?.success !== true) throw new Error("not sent");
      try {
        sessionStorage.setItem("leadSubmitted", "1");
        sessionStorage.setItem("leadFormName", name);
      } catch {
        /* ignore */
      }
      navigate({ to: "/thank-you" });
    } catch {
      setSendError(true);
      setSending(false);
    }
  };

  const dark = variant === "dark";
  const labelCls = `block text-sm font-medium ${dark ? "text-charcoal-foreground/80" : "text-foreground"}`;
  const inputCls = `mt-2 block w-full rounded-sm border px-4 text-[0.95rem] outline-none transition ${
    dark
      ? "border-charcoal-foreground/10 bg-midgrey text-charcoal-foreground placeholder:text-charcoal-foreground/40 focus:border-charcoal-foreground/50"
      : "border-input bg-card text-foreground placeholder:text-muted-foreground/60 focus:border-foreground"
  }`;
  const errCls = `mt-1.5 text-sm ${dark ? "text-[#ff8a80]" : "text-destructive"}`;
  const uid = `${id}-${name.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <div
      id={id}
      className={
        dark
          ? "text-charcoal-foreground"
          : "rounded-lg bg-card p-6 text-card-foreground shadow-lift md:p-8"
      }
    >
      {title && (
        <h2
          className={`font-heading font-semibold ${dark ? "text-2xl md:text-[1.75rem]" : "text-xl md:text-2xl"}`}
        >
          {title}
        </h2>
      )}
      {intro && (
        <p
          className={`mt-2 text-[0.95rem] ${dark ? "text-charcoal-foreground/70" : "text-muted-foreground"}`}
        >
          {intro}
        </p>
      )}
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        className={`space-y-5 ${title || intro ? "mt-6" : ""}`}
      >
        <div>
          <label htmlFor={`${uid}-name`} className={labelCls}>
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            placeholder="Your name"
            className={`${inputCls} h-12`}
            value={f.name}
            onChange={set("name")}
            onBlur={blur("name")}
            aria-invalid={!!err("name")}
          />
          {err("name") && <p className={errCls}>{err("name")}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={labelCls}>
            Phone
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Your phone number"
            className={`${inputCls} h-12`}
            value={f.phone}
            onChange={set("phone")}
            onBlur={blur("phone")}
            aria-invalid={!!err("phone")}
          />
          {err("phone") && <p className={errCls}>{err("phone")}</p>}
        </div>
        {withEmail && (
          <div>
            <label htmlFor={`${uid}-email`} className={labelCls}>
              Email
            </label>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Your email address"
              className={`${inputCls} h-12`}
              value={f.email}
              onChange={set("email")}
              onBlur={blur("email")}
              aria-invalid={!!err("email")}
            />
            {err("email") && <p className={errCls}>{err("email")}</p>}
          </div>
        )}
        {selectOptions.length > 0 && (
          <div>
            <label htmlFor={`${uid}-choice`} className={labelCls}>
              {selectLabel}
            </label>
            <select
              id={`${uid}-choice`}
              name="choice"
              className={`${inputCls} h-12`}
              value={f.choice}
              onChange={set("choice")}
            >
              <option value="">
                Select{" "}
                {selectLabel === "Service interest" ? "a service" : selectLabel.toLowerCase()}…
              </option>
              {selectOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor={`${uid}-message`} className={labelCls}>
            {messageLabel}
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={3}
            placeholder="Tell us about your project…"
            className={`${inputCls} min-h-24 py-3`}
            value={f.message}
            onChange={set("message")}
          />
        </div>
        <input
          type="checkbox"
          name="botcheck"
          className="visually-hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          checked={f.botcheck}
          onChange={(e) => setF((s) => ({ ...s, botcheck: e.target.checked }))}
        />
        {sendError && (
          <p
            role="alert"
            className={`rounded-sm p-3 text-[0.95rem] ${dark ? "bg-charcoal-foreground/10" : "bg-destructive/10 text-destructive"}`}
          >
            Sorry, that didn't send. Please call or WhatsApp us on{" "}
            <PhoneLink className="font-semibold underline" />.
          </p>
        )}
        <button
          type="submit"
          className={`btn w-full ${dark ? "btn-light" : "btn-primary"} h-12`}
          disabled={sending}
        >
          {sending ? "Sending…" : submitLabel}
          {!sending && <span aria-hidden="true">→</span>}
        </button>
        <p
          className={`text-center text-xs ${dark ? "text-charcoal-foreground/50" : "text-muted-foreground"}`}
        >
          We only use your details to reply about your project.{" "}
          <Link to="/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );
}
