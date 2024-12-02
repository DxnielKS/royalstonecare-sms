export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-900 text-white">
      <main className="flex flex-col gap-8 row-start-2 w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Royal Stone Care SMS Marketing
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Customer List Section */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customers</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {/* Example customers - replace with real data */}
              {['John Doe', 'Jane Smith', 'Bob Johnson'].map((customer) => (
                <div key={customer} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 checked:bg-blue-600"
                  />
                  <span>{customer}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Section */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Compose Message</h2>
            <div className="flex flex-col gap-4">
              <textarea 
                className="w-full h-40 p-3 border border-gray-700 rounded-lg resize-none bg-gray-700 text-white placeholder-gray-400"
                placeholder="Type your message here..."
              />
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors self-end"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
