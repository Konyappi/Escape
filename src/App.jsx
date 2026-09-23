import { Navigate, Route, Routes } from 'react-router-dom';
import Game from './pages/Game.jsx';
import Home from './pages/Home.jsx';
import HowToPlay from './pages/HowToPlay.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Result from './pages/Result.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
      <Route path="/play" element={<Game />} />
      <Route path="/result" element={<Result />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
