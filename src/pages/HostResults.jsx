import { useParams } from 'react-router-dom';
import { get, ref } from 'firebase/database';
import { db } from '../firebase.js';
import { useEffect, useState } from 'react';
export function HostResults() {
    const { roomCode, participantName } = useParams();
    const [questions, setQuestions] = useState([]);
    const [participant, setParticipant] = useState(null);

    useEffect(() => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        get(roomRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                setQuestions(data.questions);
                const participant = Object.values(data.participants || {}).find(p => p.name === participantName);
                setParticipant(participant);
            }

        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode]);
    return (
        <div>
            <h1>{participant?.name}'s Results</h1>
            <p>Score: {participant?.score}/{questions.length}</p>
            {questions.map((question, index) => (
                <div key={index}>
                    <p>{question.question}</p>
                    <p>Their answer: {participant?.userAnswers?.[index] || 'Not answered'}</p>
                    <p>Correct answer: {question.correct_answer}</p>
                </div>
            ))}
        </div>
    );


}