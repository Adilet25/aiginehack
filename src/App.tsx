import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import MuseumPage from './pages/MuseumPage'
import LootboxPage from './pages/LootboxPage'
import ProfilePage from './pages/ProfilePage'
import CalendarPage from './pages/CalendarPage'
import AdminReviewPage from './pages/AdminReviewPage'
import PetroglyphQuizPage from './pages/PetroglyphQuizPage'
import StoneWorkshopPage from './pages/StoneWorkshopPage'
import CommunityGalleryPage from './pages/CommunityGalleryPage'
import LeaderboardPage from './pages/LeaderboardPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/museum" element={<MuseumPage />} />
        <Route path="/lootbox" element={<LootboxPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin-review" element={<AdminReviewPage />} />
        <Route path="/petroglyph-quiz" element={<PetroglyphQuizPage />} />
        <Route path="/stone-workshop" element={<StoneWorkshopPage />} />
        <Route path="/community-gallery" element={<CommunityGalleryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App