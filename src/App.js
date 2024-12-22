import PromisesApp from './components/PromisesApp.jsx'
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow">
        <PromisesApp />
      </div>
      <Footer />
    </div>
  )
}

export default App