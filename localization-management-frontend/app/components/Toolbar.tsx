import { Search as LucideSearch } from "lucide-react";

export default function Toolbar() {
    return (
        <div className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 rounded-md p-2">
            <div className="flex items-center gap-2 w-full">    
                <input type="text" id="search" placeholder="Search by key, description, category, or translation value" className="border border-stone-300 dark:border-stone-600 rounded-md p-1 w-full" />
                <div>
                    <LucideSearch className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}