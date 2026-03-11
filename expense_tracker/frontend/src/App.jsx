import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import CreatePage from './pages/CreatePage'
import ExpenseDetail from './pages/ExpenseDetail'

const App = () => {
  return (
     <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route path = '/' element = {<HomePage /> } />
        <Route path = '/dashboard' element = {<Dashboard /> } />
        <Route path = '/create' element = {<CreatePage /> } />
        <Route path = '/expense/:id' element = {<ExpenseDetail /> } />
      </Routes>
    </div>
  )
}
export default App
