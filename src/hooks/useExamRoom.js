import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { get, ref, update } from 'firebase/database';
import { db, auth } from '../services/firebase';

export function useExamRoom() {
    const navigate = useNavigate();
    const { roomCode } = useParams();

    const [userAnswers, setUserAnswers] = useState({});
    const userAnswersRef = useRef({});
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [examTitle, setExamTitle] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    // Load room data on mount
    useEffect(() => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        get(roomRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                setQuestions(data.questions);
                setExamTitle(data.examTitle);
                setIsPublic(data.isPublic);

                // If host somehow lands here, redirect to lobby, but if public = navigte to exam
                if (data.hostId === auth.currentUser?.uid && !data.isPublic) {
                    navigate('/lobby/' + roomCode, { replace: true });
                    return;
                }
                // Get the current participant data
                const currentParticipant = data.participants?.[auth.currentUser.uid] || {};

                if (currentParticipant.status === 'finished' && !data.isPublic) {
                    navigate('/results', {
                        state: {
                            score: currentParticipant.score,
                            questions: data.questions,
                            userAnswers: {}
                        }
                    });
                    return;
                }
                if (data.isPublic) {
                    setTimeLeft(data.examDuration * 60);
                }
                // startedAt to calculate the remaining time if participant refreshes during the exam
                else {
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
        // Compare each answer against the correct answer using ref to avoid stale closure
        questions.forEach((question, index) => {
            if (userAnswersRef.current[index] === question.correct_answer) {
                total = total + 1;
            }
        });

        if (submitted) return;
        setSubmitted(true);
        navigate('/results', { state: { score: total, questions, userAnswers } })

        if (!isPublic) {
            // Update participant status and score in database
            update(participantRef, {
                status: 'finished',
                score: total,
                userAnswers: userAnswers
            });
        }
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

    const answeredCount = Object.keys(userAnswers).length;

    return {
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
    };
}
