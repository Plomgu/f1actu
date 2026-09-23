"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot anti-spam
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Une erreur est survenue.");
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Impossible de contacter le serveur. Réessayez plus tard.");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800">
        Merci, votre message a bien été envoyé !
      </div>
    );
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

      {/* Honeypot : champ masqué, ignoré des humains, piège pour les bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Société</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-[#C41230] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#a30f28] disabled:opacity-60"
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>
  );
}
