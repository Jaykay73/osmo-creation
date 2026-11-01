import { NextResponse } from "next/server";
import { contactPage, site } from "@/content/site";

export const runtime = "nodejs";

type EnquiryPayload = {
  name?: string;
  email?: string;
  projectType?: string;
  date?: string;
  message?: string;
  company?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let payload: EnquiryPayload;
  try {
    payload = (await request.json()) as EnquiryPayload;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The enquiry could not be read." },
      { status: 400 }
    );
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 200);
  const projectType = clean(payload.projectType, 80);
  const date = clean(payload.date, 40);
  const message = clean(payload.message, 4000);
  const company = clean(payload.company, 200);

  // Honeypot: a real visitor never fills the visually hidden field.
  if (company) {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The enquiry could not be sent." },
      { status: 400 }
    );
  }

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, code: "validation", message: "Please include your name." },
      { status: 422 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { ok: false, code: "validation", message: "Please include a valid email address." },
      { status: 422 }
    );
  }
  if (!(contactPage.projectTypes as readonly string[]).includes(projectType)) {
    return NextResponse.json(
      { ok: false, code: "validation", message: "Please choose a valid project type." },
      { status: 422 }
    );
  }
  if (message.length < 12) {
    return NextResponse.json(
      { ok: false, code: "validation", message: "Please add a little more detail." },
      { status: 422 }
    );
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { ok: false, code: "validation", message: "The proposed date is not valid." },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL ?? site.contact.email;

  if (!apiKey || !from) {
    // The form is intentionally not presented as working until email delivery
    // is configured. The client shows the direct email address instead.
    return NextResponse.json(
      {
        ok: false,
        code: "email_not_configured",
        message:
          "Online enquiries are not connected yet. Your message has not been sent — please email the studio directly at " +
          site.contact.email +
          ".",
      },
      { status: 503 }
    );
  }

  const subject = `New enquiry — ${projectType} — ${name}`;
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Project type", projectType],
    ["Proposed date", date || "Not specified"],
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
    "",
    `Sent from ${site.url}/contact`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #171512; line-height: 1.6; max-width: 620px; margin: 0 auto;">
      <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #8a8074;">OSMO Creation — new enquiry</p>
      <h1 style="font-family: Georgia, serif; font-weight: 400; font-size: 28px; margin: 12px 0 24px;">${escapeHtml(projectType)}</h1>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 24px;">
        ${rows
          .map(
            ([label, value]) => `
            <tr>
              <td style="padding: 8px 16px 8px 0; border-bottom: 1px solid #e8e1d2; color: #8a8074; font-size: 13px; white-space: nowrap;">${escapeHtml(label)}</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e8e1d2; font-size: 14px;">${escapeHtml(value)}</td>
            </tr>`
          )
          .join("")}
      </table>
      <p style="white-space: pre-wrap; font-size: 15px; margin: 0 0 24px;">${escapeHtml(message)}</p>
      <p style="font-size: 12px; color: #8a8074;">Sent from ${escapeHtml(site.url)}/contact</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      console.error("Resend enquiry failed with status", response.status);
      return NextResponse.json(
        {
          ok: false,
          code: "delivery_failed",
          message:
            "The enquiry could not be delivered. Your message has not been sent — please email the studio directly.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend enquiry request failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        ok: false,
        code: "delivery_failed",
        message:
          "The enquiry could not be delivered. Your message has not been sent — please email the studio directly.",
      },
      { status: 502 }
    );
  }
}
