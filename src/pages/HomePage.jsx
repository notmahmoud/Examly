import { useNavigate } from 'react-router-dom'

export function HomePage() {
    const navigate = useNavigate()
    
    return (
        <div className="min-h-screen bg-examly-base font-sans  flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto w-full px-6 py-20 gap-12">
                <div className="flex-1 space-y-8">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-800 leading-tight tracking-tight">
                        Run smarter exams.
                    </h1>
                    <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
                        Create, launch, and grade interactive assessments in minutes. Powered by AI, designed for modern learning.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            onClick={() => navigate('/join')}
                            className="bg-examly-accent hover:bg-teal-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-sm text-lg text-center cursor-pointer hover:-translate-y-1"
                        >
                            Join a Room
                        </button>
                        <button 
                            onClick={() => navigate('/create-exam')}
                            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-sm text-lg text-center cursor-pointer hover:-translate-y-1"
                        >
                            Create Exam
                        </button>
                        <button 
                            onClick={() => navigate('/explore')}
                            className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-xl border border-gray-200 transition-all duration-300 shadow-sm text-lg text-center cursor-pointer hover:-translate-y-1"
                        >
                            Explore
                        </button>
                    </div>
                </div>
                
                {/* Animated Mock Exam Card */}
                <div className="flex-1 w-full max-w-md perspective-1000">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform rotate-y-6 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out cursor-default" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-5deg) rotateX(5deg)' }}>
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

            {/* Vision and Mission Section */}
            <div className="bg-white border-t border-gray-100 py-24">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div id="vision" className="space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-examly-accent mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            We believe that assessments should be accessible, frictionless, and beautiful. By removing the technical barriers, we empower educators to focus on what matters most: measuring knowledge effectively.
                        </p>
                    </div>
                    
                    <div id="mission" className="space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-examly-accent mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            Our mission is to integrate AI-powered learning tools seamlessly into the classroom. We provide an intuitive platform that instantly generates intelligent quizzes, saving hours of manual work.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-examly-accent tracking-tighter">Examly</span>
                    </div>
                    <div className="text-sm font-medium text-gray-400">
                        © 2026 Examly. All rights protected.
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-gray-400">
                        <a href="#" className="hover:text-examly-accent transition-colors cursor-pointer">Privacy</a>
                        <a href="#" className="hover:text-examly-accent transition-colors cursor-pointer">Terms</a>
                        <a href="#" className="hover:text-examly-accent transition-colors cursor-pointer">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}