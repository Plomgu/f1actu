"use client";

import { useState } from "react";

import { CONTACT_EMAIL } from "../lib/legal";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[F1 Actu] Message de ${name || "un visiteur"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-[#0A0F1E]">
          Nom
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C41230] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#0A0F1E]">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C41230] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-[#0A0F1E]">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#C41230] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-[#C41230] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#a30f28]"
      >
        Envoyer
      </button>

      <p className="text-xs text-gray-500">
        L’envoi ouvre votre client email habituel avec le message pré-rempli.
      </p>
    </form>
  );
}
