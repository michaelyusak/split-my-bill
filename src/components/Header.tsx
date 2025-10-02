import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = (): React.ReactElement => {
    const navigate = useNavigate();

    return (
        <>
            <header className="p-6 flex justify-between items-center shadow-sm bg-white">
                <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>💸 SplitMyBill</h1>
                <nav className="space-x-4 text-gray-600">
                    <a href="#" className="hover:text-blue-600">About</a>
                    <a href="#" className="hover:text-blue-600">Privacy</a>
                    <a href="#" className="hover:text-blue-600">Contact</a>
                </nav>
            </header>
        </>
    )
}

export default Header