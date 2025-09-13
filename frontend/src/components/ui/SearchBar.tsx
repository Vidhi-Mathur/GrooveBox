"use client"
import { useState } from "react"

export const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    let searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        setSearchQuery(e.currentTarget.value)
    }
    return (
        <div className="relative">
            <input type="text" placeholder="Search songs, artists, or playlists..." value={searchQuery} onChange={searchHandler} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
        </div>
    )
}