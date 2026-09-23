import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { name, email, message, company } = body;

  // Honeypot : champ invisible pour les humains, rempli seulement par les bots.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !CONTACT_EMAIL) {
    console.error("Configuration SMTP manquante : vérifiez les variables d'environnement.");
    return NextResponse.json({ error: "Service de messagerie indisponible." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"F1 Actu — Formulaire de contact" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[F1 Actu] Message de ${name}`,
      text: `${message}\n\n— ${name} (${email})`,
    });
  } catch (error) {
    console.error("Échec de l'envoi de l'email de contact :", error);
    return NextResponse.json({ error: "Échec de l'envoi. Réessayez plus tard." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
