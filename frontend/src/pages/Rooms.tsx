const Rooms = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Habitaciones</h1>
              </div>
            </div>
            <div className="flex items-center">
              <a href="/" className="text-gray-700 hover:text-gray-900">Volver al Dashboard</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Habitaciones</h2>
          <p className="mt-2 text-gray-600">Funcionalidad en desarrollo...</p>
        </div>
      </main>
    </div>
  );
};

export default Rooms;