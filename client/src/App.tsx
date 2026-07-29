import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Explore } from './pages/Explore';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="*" element={<Explore />} />
    </Routes>
  );
}

export default App;

