import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import FacilityDetail from './pages/FacilityDetail';
import ListFacility from './pages/ListFacility';
import Bookings from './pages/Bookings';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/facilities/:id" element={<FacilityDetail />} />
        <Route path="/list" element={<ListFacility />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </>
  );
}
