import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Settings, Users } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout() {
    const location = useLocation();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/roster', label: 'Roster', icon: Users },
        // { href: '/config', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col relative selection:bg-blue-500/30">

            {/* --- TOP NAVBAR (Desktop & Mobile Header) --- */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center px-4 justify-between">

                    {/* Logo Area */}
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/20">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold hidden sm:inline-block tracking-tight text-foreground">
                            Sarah's Gradebook
                        </span>
                    </div>

                    {/* DESKTOP Navigation Links (Hidden on Mobile) */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center transition-colors hover:text-foreground/80 ${location.pathname === item.href ? 'text-foreground font-bold' : 'text-foreground/60'
                                    }`}
                            >
                                <item.icon className="w-4 h-4 mr-2" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        {/* REMOVED: <UserButton /> 
                           REPLACED WITH: Standard Avatar for a clean, non-auth look
                        */}
                        <Avatar className="h-8 w-8 border">
                            <AvatarImage src="" /> 
                            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 text-xs">
                                SR
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="container mx-auto flex-1 p-4 md:p-8 pb-32 md:pb-8">
                <Outlet />
            </main>

            {/* --- MOBILE LIQUID GLASS NAVBAR (iOS 26 Style) --- */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <nav className="
                    flex items-center justify-around 
                    h-20 px-2
                    rounded-[2.5rem] 
                    border border-white/20 dark:border-white/10
                    bg-white/70 dark:bg-black/40
                    backdrop-blur-3xl 
                    shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]
                    transition-all duration-300
                ">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className="relative flex flex-col items-center justify-center w-full h-full group"
                            >
                                {isActive && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/20 rounded-full blur-md" />
                                )}

                                <div className={`
                                    relative z-10 flex flex-col items-center transition-all duration-300
                                    ${isActive ? 'text-blue-600 dark:text-blue-400 -translate-y-1' : 'text-muted-foreground'}
                                `}>
                                    <item.icon
                                        className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-90'}`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className={`text-[10px] font-medium transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
                                        {item.label}
                                    </span>
                                </div>

                                {isActive && (
                                    <div className="absolute bottom-2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    );
}