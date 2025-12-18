
import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
const gameData = {
    id: 1,
    name: "The Forge [BETA]",
    platform: "Roblox",
    description: "Enter the heat of battle in The Forge! Craft legendary weaponry, master unique fighting styles, and dominate the arena in this immersive action RPG.",
    icon: "https://tr.rbxcdn.com/180DAY-e6ba7011fa99665f1d1dbb9e675d8466/150/150/Image/Webp/noFilter",
    stats: {
        totalCodes: 3,
        verifiedCodes: 3,
        usesToday: 412 + 305 + 528,
    },
    rating: 4.8,
    ratingCount: 15420,
    codes: [
        {
            id: 101,
            benefit: "2,500 Gold",
            title: "Starter Gold Pack",
            description: "A hefty bag of gold to get your blacksmithing journey started right.",
            rating: 4.9,
            ratingCount: 854,
            usesToday: 412,
            codesLeft: 850,
            code: "FORGE-STARTER-2024",
            tags: ['Hot', 'Verified']
        },
        {
            id: 102,
            benefit: "Epic Iron Ingots",
            title: "Crafting Material Bundle",
            description: "Receive 50 Epic Iron Ingots to forge higher-tier weapons immediately.",
            rating: 4.7,
            ratingCount: 620,
            usesToday: 305,
            codesLeft: 420,
            code: "IRON-WILL-CRAFT",
            tags: ['Verified']
        },
        {
            id: 103,
            benefit: "Double XP Boost (1Hr)",
            title: "Level Up Fast",
            description: "Gain double experience points for 1 hour. Perfect for grinding levels.",
            rating: 4.8,
            ratingCount: 512,
            usesToday: 528,
            codesLeft: 215,
            code: "BETA-XP-BOOST",
            tags: ['Hot']
        }
    ]
};


type Code = typeof gameData['codes'][0];
type Game = typeof gameData;


// --- SVG ICONS ---
const StarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-500 dark:text-slate-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SunIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>

// --- HELPER COMPONENTS ---

const Rating: React.FC<{ rating: number, count: number }> = ({ rating, count }) => (
    <div className="flex items-center">
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <span className="ml-1 font-bold text-slate-800 dark:text-slate-100">{rating.toFixed(1)}</span>
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">({count.toLocaleString()})</span>
    </div>
);

const Tag: React.FC<{ text: string, type: 'Hot' | 'Verified' }> = ({ text, type }) => {
    const colors = {
        Hot: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400',
        Verified: 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400',
    }
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[type]}`}>
            {text}
        </span>
    );
};

const Stat: React.FC<{ icon: React.ReactNode, value: string | number, label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
        {icon}
        <span className="ml-1.5"><span className="font-bold text-slate-800 dark:text-slate-100">{value}</span> {label}</span>
    </div>
);

const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 37;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                className="transform -rotate-90"
            >
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    className="text-slate-200 dark:text-gray-700"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
                    className="text-cyan-500"
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {`${Math.round(progress)}%`}
                </span>
            </div>
        </div>
    );
};


// --- MAIN COMPONENTS ---

const CodeCard: React.FC<{ code: Code }> = ({ code }) => {
    type Status = 'locked' | 'checking' | 'revealing';
    const [status, setStatus] = useState<Status>('locked');
    const [progress, setProgress] = useState(0);

    const startUnlockProcess = () => {
        const startRevealAnimation = () => {
            setStatus('revealing');
        };

        if (typeof (window as any)._kt === 'function') {
            (window as any)._kt();
            // After calling the content locker, we change the state to 'revealing'
            // and it will remain in this state, never showing the full code.
            startRevealAnimation();
        } else {
            console.log("DEV: Unlocking code directly (_kt not found).");
            startRevealAnimation();
        }
    };
    
    // Validity checking animation (runs only when status is 'checking')
    useEffect(() => {
        if (status !== 'checking') return;

        const duration = 2500;
        const intervalTime = 50;
        const steps = duration / intervalTime;
        let currentStep = 0;

        setProgress(0); // Reset progress

        const timer = setInterval(() => {
            currentStep++;
            const progressValue = Math.min(100, (currentStep / steps) * 100);
            setProgress(progressValue);

            if (progressValue >= 100) {
                clearInterval(timer);
                setTimeout(startUnlockProcess, 300);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [status]);


    const handleUnlockClick = () => {
        setStatus('checking');
    };

    const partialCode = `••${code.code.substring(code.code.length - 4)}`;


    return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm transition-colors duration-300">
             {status === 'checking' ? (
                <div className="flex flex-col items-center justify-center p-8 min-h-[260px]">
                    <CircularProgress progress={progress} />
                    <div className="mt-6 p-3 rounded-lg bg-slate-100 dark:bg-gray-900/50 w-full max-w-xs text-center">
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Checking chosen code validity...
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{code.benefit}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{code.description}</p>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0 ml-4">
                                {code.tags.includes('Hot') && <Tag text="Hot" type="Hot" />}
                                {code.tags.includes('Verified') && <Tag text="Verified" type="Verified" />}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                            <Rating rating={code.rating} count={code.ratingCount} />
                            <div className="flex items-center">
                                <UserIcon />
                                <span className="ml-1.5"><span className="font-semibold text-slate-700 dark:text-slate-200">{code.usesToday}</span> uses today</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50/60 dark:bg-gray-900/60 px-5 py-4 transition-colors duration-300">
                        <div className="flex justify-center items-center">
                            <div className="group flex rounded-lg shadow-sm w-full max-w-sm" >
                                <button
                                    onClick={handleUnlockClick}
                                    disabled={status === 'revealing'}
                                    className={`relative inline-flex items-center justify-center px-4 sm:px-6 py-3 rounded-l-lg bg-cyan-500 text-white font-semibold text-sm sm:text-base transition-all duration-300 ease-in-out group-hover:bg-cyan-600 group-hover:shadow-lg group-hover:shadow-cyan-500/30 ${status === 'revealing' ? 'cursor-wait animate-pulse' : ''} whitespace-nowrap`}
                                >
                                    {status === 'revealing' ? 'Unlocking...' : 'Show Full Code'}
                                </button>
                                <div className="relative flex-grow px-4 py-3 bg-white dark:bg-gray-950 border-y-2 border-r-2 border-dotted border-gray-300 dark:border-gray-600 rounded-r-lg flex items-center justify-center min-w-0 transition-colors duration-300">
                                    <span className={`font-mono text-lg tracking-widest text-slate-800 dark:text-slate-200 select-none truncate ${status === 'revealing' ? 'blur-sm' : ''}`}>
                                        {partialCode}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm mx-auto mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(code.codesLeft / 1000) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-right text-slate-600 dark:text-slate-500 mt-1">{code.codesLeft} codes left</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


const GameHeader: React.FC<{ game: Game }> = ({ game }) => (
    <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 backdrop-blur-md transition-colors duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={game.icon} alt={game.name} className="w-24 h-24 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-700" />
            <div className="flex-grow">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2 py-1 rounded">{game.platform}</span>
                <h1 className="text-3xl font-bold mt-2 text-slate-900 dark:text-slate-50">{game.name}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{game.description}</p>
                <div className="flex items-center mt-3">
                    <Rating rating={game.rating} count={game.ratingCount} />
                </div>
            </div>
            <div className="flex flex-col items-start sm:items-end space-y-2 self-stretch sm:self-center">
                 <Stat icon={<CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400" />} value={game.stats.verifiedCodes} label="Verified Codes" />
                 <Stat icon={<UserIcon className="w-4 h-4" />} value={game.stats.usesToday.toLocaleString()} label="Uses Today" />
            </div>
        </div>

        <div className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4 pb-2 border-b-2 border-slate-300/50 dark:border-slate-600/40">
                Available Promo Codes
            </h2>
            <div className="space-y-4">
                {game.codes.map(code => (
                    <CodeCard key={code.id} code={code} />
                ))}
            </div>
        </div>
    </div>
);

const ThemeToggle: React.FC<{ isDarkMode: boolean; setIsDarkMode: (isDark: boolean) => void; }> = ({ isDarkMode, setIsDarkMode }) => (
    <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-slate-200/80 dark:bg-gray-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-gray-700 shadow-md transition-all duration-200"
        aria-label="Toggle theme"
    >
        {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
    </button>
)

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false;
        if (localStorage.theme === 'dark') {
            return true;
        } else if (localStorage.theme === 'light') {
            return false;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            root.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [isDarkMode]);

    return (
        <div className="relative min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto mt-8"> {/* Added top margin to account for fixed toggle on mobile if needed, though toggle is right-aligned */}
                <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                <GameHeader game={gameData} />
            </div>
        </div>
    );
};

export default App;
