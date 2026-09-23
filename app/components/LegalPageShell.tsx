import SiteHeader from "./SiteHeader";

export default function LegalPageShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F0F2F5] min-h-screen py-2 sm:py-6">
      <div className="max-w-7xl mx-auto rounded-none sm:rounded-3xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/40 overflow-hidden">
        <SiteHeader />

        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0F1E]">{title}</h1>
          {updated && (
            <p className="mt-2 text-sm text-gray-500">Dernière mise à jour : {updated}</p>
          )}

          <div className="mt-8 space-y-6 text-sm sm:text-base leading-relaxed text-gray-700 [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-[#0A0F1E] [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-[#C41230] [&_a]:underline [&_a:hover]:no-underline [&_strong]:font-semibold [&_strong]:text-[#0A0F1E]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
