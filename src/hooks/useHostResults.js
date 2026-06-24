import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, ref } from 'firebase/database';
import { db } from '../services/firebase';

export function useHostResults() {
    const { roomCode, participantName } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [participant, setParticipant] = useState(null);

    useEffect(() => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        get(roomRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                setQuestions(data.questions);
                const found = Object.values(data.participants || {}).find(
                    p => p.name === participantName
                );
                setParticipant(found);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode]);

    return { questions, participant, roomCode, navigate };
}
