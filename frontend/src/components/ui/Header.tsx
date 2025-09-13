import Link from "next/link"
import { SearchBar } from "./SearchBar"

export const Header = () => {
    return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">

                    </div>
                    <span className="text-xl font-bold text-slate-700 dark:text-slate-100">
                        GrooveBox
                    </span>
                </div>
                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-8">
                    <SearchBar />
                </div>
                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    <Link href="#" className="text-slate-700 dark:text-slate-100 hover:text-emerald-600 transition-colors">Home</Link>
                    <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors">Browse</Link>
                    <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors">Library</Link>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors">
                        Sign In
                    </button>
                </nav>
            </div>
        </div>
    </header>
  )
}
