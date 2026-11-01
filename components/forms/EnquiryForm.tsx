"use client";

import { useEffect, useMemo, useState } from "react";
import { contactPage, site } from "@/content/site";
import { ArrowRight } from "@/components/ui/Icons";

type FormState = {
  name: string;
  email: string;
  projectType: string;
  date: string;
  message: string;
  company: string;
};

type Errors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "sending" | "success" | "error" | "unconfigured";

const initialForm: FormState = {
  name: "",
  email: "",
  projectType: "",
  date: "",
  message: "",
  company: "",
};

export function EnquiryForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("type");
    if (requested && contactPage.projectTypes.some((type) => type === requested)) {
      setForm((current) => ({ ...current, projectType: requested }));
    }
  }, []);

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(
      form.projectType ? `Enquiry — ${form.projectType}` : "Project enquiry — OSMO Creation"
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Project type: ${form.projectType || "Not specified"}`,
        `Proposed date: ${form.date || "Not specified"}`,
        "",
        form.message,
      ].join("\n")
    );
    return `mailto:${site.contact.email}?subject=${subject}&body=${body}`;
  }, [form]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "error" || status === "unconfigured") {
      setStatus("idle");
      setServerMessage("");
    }
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.projectType) next.projectType = "Please choose the kind of project.";
    if (form.message.trim().length < 12) {
      next.message = "A little more detail will help us respond well.";
    }
    if (form.message.length > 4000) {
      next.message = "Please keep the message under 4,000 characters.";
    }
    return next;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }

    setStatus("sending");
    setServerMessage("");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          projectType: form.projectType,
          date: form.date,
          message: form.message,
          company: form.company,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; code?: string; message?: string }
        | null;

      if (response.ok && data?.ok) {
        setSubmittedName(form.name);
        setStatus("success");
        setForm(initialForm);
        return;
      }
      if (response.status === 503 && data?.code === "email_not_configured") {
        setStatus("unconfigured");
        setServerMessage(
          data.message ??
            "Online enquiries are not connected yet. Your message has not been sent."
        );
        return;
      }
      setStatus("error");
      setServerMessage(
        data?.message ??
          "Something went wrong while sending the enquiry. Your message has not been sent."
      );
    } catch {
      setStatus("error");
      setServerMessage(
        "The message could not reach the server. Check your connection, or email us directly."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <p className="eyebrow eyebrow--dark">
          <span className="eyebrow-rule" aria-hidden="true" />
          <span>Enquiry sent</span>
        </p>
        <h2 className="form-success-title">
          Thank you{submittedName ? `, ${submittedName.split(" ")[0]}` : ""}.
        </h2>
        <p>
          Your note has been received by the studio. A reply will be sent to your email
          address.
        </p>
        <button
          type="button"
          className="cta cta--small cta--dark"
          onClick={() => {
            setSubmittedName("");
            setStatus("idle");
          }}
        >
          Send another enquiry
          <ArrowRight />
        </button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="field-name">Your name</label>
          <input
            id="field-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "error-name" : undefined}
            required
          />
          {errors.name ? (
            <p className="field-error" id="error-name">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="field-email">Email</label>
          <input
            id="field-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "error-email" : undefined}
            required
          />
          {errors.email ? (
            <p className="field-error" id="error-email">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="field-projectType">Type of project</label>
          <select
            id="field-projectType"
            name="projectType"
            value={form.projectType}
            onChange={(event) => update("projectType", event.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={errors.projectType ? "error-projectType" : undefined}
            required
          >
            <option value="">Choose one</option>
            {contactPage.projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.projectType ? (
            <p className="field-error" id="error-projectType">
              {errors.projectType}
            </p>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="field-date">
            Proposed date <span className="label-optional">(if relevant)</span>
          </label>
          <input
            id="field-date"
            name="date"
            type="date"
            value={form.date}
            onChange={(event) => update("date", event.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="field-message">Tell us a little about it</label>
        <textarea
          id="field-message"
          name="message"
          rows={6}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "error-message" : "message-hint"}
          maxLength={4000}
          required
        />
        <p className="field-hint" id="message-hint">
          The people, the place, what you want to keep.
        </p>
        {errors.message ? (
          <p className="field-error" id="error-message">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="field-company">Company</label>
        <input
          id="field-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(event) => update("company", event.target.value)}
        />
      </div>

      {status === "unconfigured" || status === "error" ? (
        <div className="form-notice" role="alert">
          <p className="form-notice-title">
            {status === "unconfigured"
              ? "Online enquiries aren’t connected yet."
              : "The enquiry didn’t send."}
          </p>
          <p>{serverMessage}</p>
          <a href={mailto} className="cta cta--small cta--dark">
            Email the studio directly
            <ArrowRight />
          </a>
          <p className="form-notice-small">
            This opens your email app with your message ready to send to{" "}
            <span>{site.contact.email}</span>.
          </p>
        </div>
      ) : null}

      <div className="form-submit-row">
        <p className="form-privacy">
          Your details are used only to reply to this enquiry. They are not shared or added
          to a mailing list.
        </p>
        <button
          type="submit"
          className="form-submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
        >
          <span>{status === "sending" ? "Sending enquiry" : "Send enquiry"}</span>
          <ArrowRight />
        </button>
      </div>
    </form>
  );
}
