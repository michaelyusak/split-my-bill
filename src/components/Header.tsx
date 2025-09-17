import React from 'react'

const Header = (): React.ReactElement => {
    return (
        <>
            <header className="p-6 flex justify-between items-center shadow-sm bg-white">
                <h1 className="text-2xl font-bold text-blue-600">💸 SplitMyBill</h1>
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