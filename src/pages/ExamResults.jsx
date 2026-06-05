import { useLocation, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export function ExamResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, questions, userAnswers } = location.state || {};

    if (!questions) return <Navigate to="/" />;
    
    // Decode HTML entities in questions and answers for proper display
    const decode = (str) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }

    return (
        <div className="min-h-screen bg-examly-base font-sans animate-fade-in flex flex-col pb-32">
            <div className="flex-1 max-w-3xl w-full mx-auto px-6 pt-20">
                <div className="text-center mb-16">
                    <h1 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">Final Score</h1>
                    <div className="inline-block bg-white rounded-3xl shadow-sm border border-gray-100 px-12 py-8">
                        <span className="text-7xl font-bold text-examly-accent">{score}</span>
                        <span className="text-4xl font-medium text-gray-300 mx-3">/</span>
                        <span className="text-4xl font-bold text-gray-700">{questions.length}</span>
                    </div>
                </div>

                <div className="space-y-6 mb-16">
                    {questions.map((question, index) => {
                        const isCorrect = userAnswers[index] === question.correct_answer;
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 overflow-hidden relative">
                                {/* Left border indicator */}
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                
                                <h3 className="text-lg font-medium text-gray-800 mb-6 pl-4">
                                    <span className="font-bold mr-2 text-gray-400">{index + 1}.</span>
                                    {decode(question.question)}
                                </h3>
                                
                                <div className="space-y-3 pl-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-28 text-xs font-bold text-gray-400 uppercase pt-1">Your Answer</div>
                                        <div className={`flex-1 font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                            {decode(userAnswers[index] || 'Not answered')}
                                        </div>
                                    </div>
                                    
                                    {!isCorrect && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-28 text-xs font-bold text-gray-400 uppercase pt-1">Correct</div>
                                            <div className="flex-1 font-bold text-gray-800">
                                                {decode(question.correct_answer)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-examly-accent hover:brightness-95 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-sm"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}