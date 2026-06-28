import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-[#f7f6f3] pt-20 flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-6xl mb-6">🏚️</p>
        <h1 className="font-heading font-semibold text-3xl text-pg-dark mb-3">
          Property Not Found
        </h1>
        <p className="text-pg-muted text-base mb-8 max-w-sm mx-auto">
          This listing may have been sold, removed, or the URL may be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center px-7 py-3 bg-pg-dark text-white font-semibold text-sm rounded-md hover:bg-pg-body transition-colors"
          >
            Browse All Properties
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-7 py-3 border border-pg-dark text-pg-dark font-semibold text-sm rounded-md hover:bg-pg-dark hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
