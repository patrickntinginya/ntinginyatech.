"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { contactInfo } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Fields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
};
type FieldName = keyof Fields;
type Status = "idle" | "sending" | "success" | "unconfigured" | "rate_limited" | "error";

const emptyFields: Fields = { name: "", email: "", phone: "", company: "", subject: "", message: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Fields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";
  if (!values.message.trim()) errors.message = "Tell us how we can help.";
  return errors;
}

const inputClass =
  "w-full rounded-lg border border-deep/30 bg-white px-3.5 py-3 font-sans text-base text-deep placeholder:text-deep/50 focus-visible:border-field-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-field-700 aria-[invalid=true]:border-red-700";

function Field({
  name,
  label,
  required,
  error,
  children,
}: {
  name: FieldName;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`field-${name}`} className="mb-1.5 block font-sans text-sm font-semibold">
        {label}
        {required ? <span className="text-red-700"> *</span> : <span className="font-normal text-deep/70"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`error-${name}`} className="mt-1.5 flex items-start gap-1.5 font-sans text-sm text-red-700">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [values, setValues] = useState<Fields>({ ...emptyFields, subject: defaultSubject });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as FieldName]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as FieldName[])[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    const honeypot = (new FormData(event.currentTarget).get("website") as string | null) ?? "";
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      if (response.ok) {
        setStatus("success");
        setValues(emptyFields);
      } else if (response.status === 501) {
        setStatus("unconfigured");
      } else if (response.status === 429) {
        setStatus("rate_limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(values.subject || "Enquiry from website")}&body=${encodeURIComponent(
    `${values.message}\n\n${values.name}${values.company ? `, ${values.company}` : ""}${values.phone ? `\n${values.phone}` : ""}`,
  )}`;

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-field-700/40 bg-field-100 p-8">
        <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-field-700" />
        <h3 className="mt-4 font-sans text-2xl font-semibold tracking-tight">Message received</h3>
        <p className="mt-2 text-base leading-relaxed text-deep/85">Thank you for contacting Ntinginya Tech. We will reply to the email address you gave us.</p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="form-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" required error={errors.name}>
          <input
            id="field-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "error-name" : undefined}
            className={inputClass}
          />
        </Field>
        <Field name="email" label="Email" required error={errors.email}>
          <input
            id="field-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={onChange}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "error-email" : undefined}
            className={inputClass}
          />
        </Field>
        <Field name="phone" label="Phone">
          <input id="field-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={onChange} className={inputClass} />
        </Field>
        <Field name="company" label="Company">
          <input id="field-company" name="company" type="text" autoComplete="organization" value={values.company} onChange={onChange} className={inputClass} />
        </Field>
      </div>

      <Field name="subject" label="Subject">
        <input
          id="field-subject"
          name="subject"
          type="text"
          list="subject-suggestions"
          value={values.subject}
          onChange={onChange}
          className={inputClass}
        />
        <datalist id="subject-suggestions">
          <option value="Software or a custom solution" />
          <option value="Ntinginya Business Manager" />
          <option value="Agriculture and livestock technology" />
          <option value="Ntinginya Masterclass" />
          <option value="Research or partnership" />
          <option value="General enquiry" />
        </datalist>
      </Field>

      <Field name="message" label="Message" required error={errors.message}>
        <textarea
          id="field-message"
          name="message"
          rows={6}
          maxLength={5000}
          value={values.message}
          onChange={onChange}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "error-message" : undefined}
          className={cn(inputClass, "resize-y")}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="field-website">Website</label>
        <input id="field-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div id="form-status" aria-live="polite">
        {status === "unconfigured" ? (
          <p className="rounded-lg border border-maize-700/50 bg-maize-300/40 p-4 font-sans text-[0.9375rem] leading-relaxed">
            Online sending is not switched on yet, so your message was not sent.{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              Send it by email instead
            </a>{" "}
            using {contactInfo.email}.
          </p>
        ) : null}
        {status === "rate_limited" ? (
          <p role="alert" className="rounded-lg border border-maize-700/50 bg-maize-300/40 p-4 font-sans text-[0.9375rem] leading-relaxed">
            You have sent several messages in a short time. Please wait a few minutes and try again, or{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              email us directly
            </a>
            .
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="rounded-lg border border-red-700/40 bg-red-50 p-4 font-sans text-[0.9375rem] leading-relaxed text-red-900">
            Something went wrong and your message was not sent. Please try again, or{" "}
            <a href={mailto} className="font-semibold underline underline-offset-4">
              email us directly
            </a>
            .
          </p>
        ) : null}
      </div>

      <Button type="submit" variant="dark" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? (
          <>
            <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          "Talk to Ntinginya Tech"
        )}
      </Button>
    </form>
  );
}
