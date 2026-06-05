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
                // save participant's current status in case they refresh
                const currentParticipant = data.participants?.[auth.currentUser.uid];
                if (currentParticipant?.status === 'finished') {
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
                if (!data.startedAt) {
                    update(ref(db, 'rooms/' + roomCode), { startedAt: Date.now() });
                    setTimeLeft(data.examDuration * 60); // first join, full time
                } else {
                    const elapsed = Math.floor((Date.now() - data.startedAt) / 1000);
                    const remaining = (data.examDuration * 60) - elapsed;
                    setTimeLeft(remaining > 0 ? remaining : 0); // returning after refresh
                }

            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // useRef to keep track of userAnswers without worrying about stale closures in the timer

    const handleAnswer = (option, index) => {
        const updated = { ...userAnswers, [index]: option };
        setUserAnswers(updated);
        userAnswersRef.current = updated; // always up to date
    }
    if (!questions) return <Navigate to="/" />;


    return (
        <>
            {questions.length > 0 && <h1>{examTitle}</h1>}
            {questions.length > 0 && <p>Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>}

            {questions.length > 0 &&
                questions.map((question, index) => {
                    // filter out empty strings for true/false questions
                    const filteredIncorrect = question.incorrect_answers.filter(a => a !== '');
                    const isTrueFalse = filteredIncorrect.length === 1;
                    const options = isTrueFalse ? ['True', 'False'] : [...filteredIncorrect, question.correct_answer];
                    return (
                        <div key={index}>
                            <p>{question.question}</p>
                            {options.map(option => (
                                <button key={option} onClick={() => handleAnswer(option, index)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    );
                })}
            {questions.length > 0 && !submitted && <button onClick={scoreCalculate}>Submit</button>}
        </>
    );


}