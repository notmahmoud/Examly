import { useNavigate } from 'react-router-dom';
import { FeaturedRooms } from './components/FeaturedRooms';
import { VisionSection } from './components/VisionSection';
import { AboutSection } from './components/AboutSection';

export function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            {/* Hero Section */}
            <div className="bg-examly-base border-b border-gray-100 shadow-sm w-full">
                <div className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto w-full px-6 py-20 gap-12">
                    <div className="flex-1 space-y-8">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight">
                            Interactive Exam Platform
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
                            Create, host, and analyze live exam sessions instantly with AI. Designed for educators and students.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => navigate('/create-exam')}
                                className="bg-examly-accent hover:brightness-90 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-300 shadow-sm text-base text-center cursor-pointer"
                            >
                                Create Exam
                            </button>
                            <button
                                onClick={() => navigate('/join')}
                                className="bg-white hover:border-examly-accent hover:text-examly-accent text-gray-800 font-medium py-3 px-6 rounded-xl border border-gray-200 transition-colors duration-300 shadow-sm text-base text-center cursor-pointer"
                            >
                                Join Room
                            </button>
                        </div>
                    </div>

                    {/* Animated Mock Exam Card */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:border-examly-accent transition-colors duration-300 cursor-default">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Question 1</span>
                                <div className="bg-teal-50 text-examly-accent font-bold px-3 py-1 rounded-full text-xs">00:45</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                                What is the primary function of a mitochondria in a cell?
                            </h3>
                            <div className="space-y-3">
                                {['Cellular respiration', 'Protein synthesis', 'Lipid storage', 'DNA replication'].map((opt, i) => (
                                    <div key={i} className={`p-4 rounded-xl border-2 font-medium transition-colors cursor-pointer ${i === 0 ? 'border-examly-accent bg-examly-accent text-white' : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <div className="w-full h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FeaturedRooms />
            <VisionSection />
            <AboutSection />

            {/* Footer */}
            <footer className="bg-examly-base border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-10 relative z-10 w-full">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
                    <div className="flex justify-center md:justify-start">
                        <span className="text-2xl font-black text-examly-accent tracking-tighter">Examly</span>
                    </div>
                    <div className="text-sm font-medium text-gray-500 flex justify-center">
                        © 2026 Examly
                    </div>
                    <div className="flex justify-center md:justify-end gap-6 text-sm font-medium text-gray-500">
                        <a href="#" className="hover:text-examly-accent transition-colors cursor-pointer">Privacy</a>
                        <a href="#" className="hover:text-examly-accent transition-colors cursor-pointer">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}