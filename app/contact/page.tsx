import type { Metadata } from "next";

import LegalPageShell from "../components/LegalPageShell";
import ContactForm from "../components/ContactForm";
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from "../lib/legal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez l’équipe de ${SITE_NAME} pour une question, une suggestion, un signalement d’erreur ou une demande de partenariat autour de la Formule 1.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <LegalPageShell title="Contact">
      <p>
        Une question, une remarque, un signalement d’erreur ? Écrivez-nous
        directement à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, ou utilisez
        le formulaire ci-dessous.
      </p>
      <ContactForm />
    </LegalPageShell>
  );
}
