import { Navigate } from 'react-router-dom';
import { useExamRoom } from '../hooks/useExamRoom';

export function ExamRoom() {
    const {
        questions,
        examTitle,
        userAnswers,
        submitted,
        minutes,
        seconds,
        isTimeLow,
        showSubmitModal,
        setShowSubmitModal,
        showLeaveModal,
        setShowLeaveModal,
        handleAnswer,
        scoreCalculate,
        answeredCount,
        navigate
    } = useExamRoom();

    if (!questions) return <Navigate to="/" />;

    return (
        <div className="min-h-screen bg-examly-base font-sans  flex flex-col pb-32">

            {/* Specific Exam Top Bar */}
            {questions.length > 0 && (
                <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6 shadow-sm">
                    {/* Left: Back Button & Title */}
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setShowLeaveModal(true)}
                            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h2 className="font-bold text-gray-800 hidden sm:block truncate max-w-xs">{examTitle}</h2>
                    </div>

                    {/* Center: Timer */}
                    <div className="flex-1 flex justify-center">
                        <div className={`px-4 py-1.5 rounded-full font-bold text-lg border tracking-wider ${isTimeLow ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </div>
                    </div>

                    {/* Right: Progress & Submit */}
                    <div className="flex items-center justify-end gap-6 flex-1">
                        <span className="text-sm font-bold text-gray-500 hidden md:block">
                            <span className={answeredCount === questions.length ? 'text-examly-accent' : 'text-gray-800'}>{answeredCount}</span>
                            <span className="mx-1">/</span>
                            {questions.length} answered
                        </span>
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="bg-examly-accent hover:bg-teal-800 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer text-sm"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 max-w-3xl w-full mx-auto px-6 pt-24">
                <div className="space-y-4">
                    {questions.length > 0 &&
                        questions.map((question, index) => {
                            // filter out empty strings for true/false questions
                            const filteredIncorrect = question.incorrect_answers.filter(a => a !== '');
                            const isTrueFalse = filteredIncorrect.length === 1;
                            const options = isTrueFalse ? ['True', 'False'] : [...filteredIncorrect, question.correct_answer];
                            return (
                                <div key={index} id={`question-${index}`} className="py-10 border-b border-gray-200 last:border-0 text-left">
                                    <h2 className="text-xl font-medium text-gray-800 mb-8 leading-relaxed flex">
                                        <span className="text-gray-400 font-bold mr-4 w-6">{index + 1}.</span>
                                        <span className="flex-1">{question.question}</span>
                                    </h2>
                                    <div className="space-y-3 pl-10">
                                        {options.map(option => {
                                            const isSelected = userAnswers[index] === option;
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleAnswer(option, index)}
                                                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 font-medium cursor-pointer ${isSelected ? 'bg-examly-accent text-white border-examly-accent' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {questions.length > 0 && !submitted && (
                    <div className="mt-16 mb-8 flex justify-end">
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="bg-examly-accent hover:bg-teal-800 text-white font-bold py-4 px-12 rounded-xl cursor-pointer  shadow-md text-lg"
                        >
                            Submit Exam
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal - Submit */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-auto transform transition-all">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Submit Exam?</h3>
                        <p className="text-gray-500 mb-8 text-center leading-relaxed">
                            {answeredCount < questions.length
                                ? `You have ${questions.length - answeredCount} unanswered questions. Are you sure you want to submit?`
                                : 'Are you sure you want to submit your answers? You cannot undo this action.'}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowSubmitModal(false);
                                    scoreCalculate();
                                }}
                                className="flex-1 py-3 px-4 bg-examly-accent hover:bg-teal-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal - Leave */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm  px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-auto transform transition-all">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Leave Exam?</h3>
                        <p className="text-gray-500 mb-8 text-center leading-relaxed">
                            Are you sure you want to exit? Your progress will be lost and you will get a score of 0.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    navigate('/');
                                }}
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}