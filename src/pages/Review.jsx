import { Navigate } from 'react-router-dom';
import { useReview } from '../hooks/useReview';

const STEPS = [
    { num: 1, label: 'Settings', desc: 'Title, duration & visibility' },
    { num: 2, label: 'Questions', desc: 'Add or generate questions' },
    { num: 3, label: 'Launch', desc: 'Review and go live' },
];

export function Review() {
    const {
        questions,
        examTitle,
        examDescription,
        examDuration,
        difficulty,
        questionsCount,
        type,
        isPublic,
        handleLaunch
    } = useReview();

    if (!questions) return <Navigate to="/create-exam" />;

    return (
        <div className="min-h-screen bg-examly-base font-sans flex pb-24">

            {/* ── LEFT SIDEBAR ── */}
            <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-0 h-screen bg-white border-r border-gray-100 shadow-sm px-6 py-10">
                <div className="mb-10">
                    <span className="text-xs font-bold text-examly-accent uppercase tracking-widest">Examly</span>
                    <h2 className="text-xl font-bold text-gray-800 mt-1">Review</h2>
                </div>

                <nav className="flex flex-col gap-2">
                    {STEPS.map((s) => {
                        const isActive = 3 === s.num;
                        const isDone = 3 > s.num;
                        return (
                            <div key={s.num}
                                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${isActive ? 'bg-teal-50 border border-teal-100' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${isDone ? 'bg-examly-accent text-white' : isActive ? 'bg-examly-accent text-white ring-4 ring-teal-100' : 'bg-gray-200 text-gray-400'}`}>
                                    {isDone ? 'Done' : s.num}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${isActive ? 'text-gray-800' : isDone ? 'text-gray-600' : 'text-gray-400'}`}>{s.label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Summary Box */}
                <div className="mt-auto pt-10">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-examly-accent/10 flex items-center justify-center text-examly-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="font-bold text-gray-800 text-sm">Exam Summary</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Difficulty</span>
                                <span className="font-bold text-gray-700 capitalize">{difficulty}</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Duration</span>
                                <span className="font-bold text-gray-700">{examDuration} min</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Visibility</span>
                                <span className={`font-bold text-xs uppercase tracking-wider px-2 py-1 rounded-md ${isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {isPublic ? 'Public' : 'Private'}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0">

                <main className="flex-1 px-6 lg:px-10 xl:px-16 py-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">{examTitle}</h1>
                            {examDescription && <p className="text-gray-500 mt-2 font-medium">{examDescription}</p>}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    Questions
                                    <span className="bg-teal-50 text-examly-accent text-xs font-bold px-2.5 py-1 rounded-full border border-teal-100">
                                        {questions.length}
                                    </span>
                                </h2>
                            </div>

                            <div className="space-y-8">
                                {questions.map((q, index) => (
                                    <div key={index} className="pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                                        <h3 className="font-medium text-gray-800 mb-4 flex">
                                            <span className="text-gray-300 font-bold mr-3">{index + 1}.</span>
                                            {q.question}
                                        </h3>
                                        <div className="pl-7 space-y-2">
                                            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">{q.correct_answer}</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {q.incorrect_answers.map((ans, i) => (
                                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl opacity-75">
                                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                                                            ×
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-500">{ans}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* ── FIXED BOTTOM BAR ── */}
                <div className="fixed bottom-0 left-0 lg:left-64 xl:left-72 right-0 z-30 bg-white/90 backdrop-blur border-t border-gray-100 shadow-sm px-6 lg:px-10 xl:px-16 py-4 flex items-center justify-center lg:justify-between gap-4">
                    <button onClick={() => window.history.back()}
                        className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all cursor-pointer">
                        Back to Editor
                    </button>
                    <button onClick={handleLaunch}
                        className="px-8 py-3 rounded-xl bg-examly-accent hover:bg-teal-800 text-white font-bold text-sm transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Launch Exam Room
                    </button>
                </div>
            </div>
        </div>
    );
}