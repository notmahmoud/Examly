import { useLocation, useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { db, auth } from '../services/firebase';

export function useReview() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, examTitle, examDescription, examDuration, difficulty, questionsCount, type, isPublic } = location.state || {};

    const handleLaunch = async () => {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await set(ref(db, 'rooms/' + roomCode), {
            roomCode,
            hostId: auth.currentUser.uid,
            questions,
            examTitle,
            examDuration,
            difficulty,
            questionsCount,
            type,
            isPublic,
            status: 'waiting',
            participants: {},
            createdAt: Date.now()
        });

        if (isPublic) {
            await set(ref(db, 'publicRooms/' + roomCode), {
                roomCode,
                examTitle,
                examDescription,
                difficulty,
                questionsCount,
                hostId: auth.currentUser.uid,
                createdAt: Date.now()
            });
        }
        if (isPublic) {
            navigate('/exam/' + roomCode, { replace: true });
        } else {
            navigate('/lobby/' + roomCode, { replace: true });
        }
    };

    return {
        questions,
        examTitle,
        examDescription,
        examDuration,
        difficulty,
        questionsCount,
        type,
        isPublic,
        handleLaunch
    };
}
