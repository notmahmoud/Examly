import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.js';
import { ref, set} from 'firebase/database';
import { auth } from '../firebase.js';
import { Navigate } from 'react-router-dom';
export function Review() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, examTitle, examDescription, examDuration, difficulty, questionsCount, type, isPublic } = location.state || {};
    if (!questions) return <Navigate to="/" />;
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

    return (
        <>
            <h1>Ready to Launch!</h1>
            <p>Review your quiz details before generating the room code.</p>
            {examTitle && <h2>{examTitle}</h2>}
            {examDescription && <p>{examDescription}</p>}
            <p>Duration: {examDuration} minutes</p>
            <p>Difficulty: {difficulty}</p>
            <p>Questions: {questionsCount}</p>
            <p>Type: {type}</p>
            <p>Public: {isPublic ? 'Yes' : 'No'}</p>
            <button onClick={handleLaunch}>Launch Room</button>
        </>
    )
}