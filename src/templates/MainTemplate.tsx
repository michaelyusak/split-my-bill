import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const MainTemplate = (): React.ReactElement => {
    return (
        <>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header></Header>

                <Outlet></Outlet>

                <Footer></Footer>
            </div>
        </>
    )
}

export default MainTemplate