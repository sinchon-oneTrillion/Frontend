export default function Container({ children, className = '' }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 py-6 pt-32 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
