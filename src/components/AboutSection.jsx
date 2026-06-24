export function AboutSection() {
    return (
        <div className="bg-white py-24 w-full cursor-pointer">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-gray-800 leading-tight">A Smarter Way to Run Exams</h2>
                    <p className="text-lg text-gray-500 leading-relaxed font-medium">
                        Examly is a real-time exam platform designed to bridge the gap between educators and students. We believe assessments should be frictionless, insightful, and accessible to everyone.
                    </p>
                    <div className="space-y-6 pt-4">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 bg-teal-50 text-examly-accent p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-800">Live Synchronization</h4>
                                <p className="text-gray-500">Every student's progress is tracked and synced in real-time.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 bg-teal-50 text-examly-accent p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-800">Intuitive Interface</h4>
                                <p className="text-gray-500">A clean, distraction-free design inspired by modern SaaS apps.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 bg-teal-50 text-examly-accent p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-800">Secure & Reliable</h4>
                                <p className="text-gray-500">Built on top of robust real-time database architecture.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative hidden md:flex items-center justify-center">
                    <img
                        src="/examly_education_illustration.png"
                        alt="Educational platform illustration"
                        className="w-full h-auto max-w-md mx-auto rounded-3xl shadow-lg border border-gray-100 object-cover hover:-translate-y-2 transition-transform duration-500"
                    />
                </div>
            </div>
        </div>
    );
}
