import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { get, ref } from 'firebase/database';
import { db } from '../firebase.js';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase.js';
import { update } from 'firebase/database';

export function ExamRoom() {

    const navigate = useNavigate();

    const [userAnswers, setUserAnswers] = useState({});
    const userAnswersRef = useRef({});
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const { roomCode } = useParams();
    const [questions, setQuestions] = useState([]);
    const [examTitle, setExamTitle] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Load room data on mount
    useEffect(() => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        get(roomRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                setQuestions(data.questions);
                setExamTitle(data.examTitle);
                if (data.isPublic) {
                    update(ref(db, 'rooms/' + roomCode), { status: 'active' });
                }
                // If host somehow lands here, redirect to lobby, but if public = navigte to exam
                if (data.hostId === auth.currentUser?.uid && !data.isPublic) {
                    navigate('/lobby/' + roomCode, { replace: true });
                    return;
                }
                // Get the current participant data
                const currentParticipant = data.participants?.[auth.currentUser.uid] || {};
                
                if (currentParticipant.status === 'finished') {
                    navigate('/results', {
                        state: {
                            score: currentParticipant.score,
                            questions: data.questions,
                            userAnswers: {}
                        }
                    });
                    return;
                }

                // startedAt to calculate the remaining time if participant refreshes during the exam
                if (!currentParticipant.startedAt) {
                    const now = Date.now();
                    update(ref(db, `rooms/${roomCode}/participants/${auth.currentUser.uid}`), { startedAt: now });
                    setTimeLeft(data.examDuration * 60); // first join, full time
                } else {
                    const elapsed = Math.floor((Date.now() - currentParticipant.startedAt) / 1000);
                    const remaining = (data.examDuration * 60) - elapsed;
                    setTimeLeft(remaining > 0 ? remaining : 0); // returning after refresh
                }

            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Warn before unload
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!submitted) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [submitted]);

    const scoreCalculate = () => {
        let total = 0;
        // Mark participant as finished in database
        const participantRef = ref(db, 'rooms/' + roomCode + '/participants/' + auth.currentUser.uid);
        update(participantRef, { status: 'finished' });

        // Compare each answer against the correct answer using ref to avoid stale closure
        questions.forEach((question, index) => {
            if (userAnswersRef.current[index] === question.correct_answer) {
                total = total + 1;
            }
        });

        if (submitted) return;
        setSubmitted(true);
        navigate('/results', { state: { score: total, questions, userAnswers } })

        // Update participant status and score in database
        update(participantRef, {
            status: 'finished',
            score: total,
            userAnswers: userAnswers
        });
    };


    useEffect(() => {
        if (timeLeft <= 0 && questions.length > 0) {
            setTimeout(() => scoreCalculate(), 0);
            return;
        }
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isTimeLow = timeLeft < 60;

    // useRef to keep track of userAnswers without worrying about stale closures in the timer

    const handleAnswer = (option, index) => {
        const updated = { ...userAnswers, [index]: option };
        setUserAnswers(updated);
        userAnswersRef.current = updated; // always up to date
    }

    if (!questions) return <Navigate to="/" />;

    const answeredCount = Object.keys(userAnswers).length;

    return (
        <div className="min-h-screen bg-examly-base font-sans animate-fade-in flex flex-col pb-32">
            
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
                            className="bg-examly-accent hover:bg-teal-800 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-md text-lg"
                        >
                            Submit Exam
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal - Submit */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fade-in px-4">
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fade-in px-4">
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