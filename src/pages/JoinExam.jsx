import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.js';
export function JoinExam() {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');


    const handleJoin = async () => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        const snapshot = await get(roomRef);
        const data = snapshot.val();
        if (data) {
            navigate('/lobby/' + roomCode, { replace: true });
        } else {
            setError('Room not found. Please check the code and try again.');
        }
    }

    return (
        <>
            <h1>Join a Room</h1>
            <p>Enter the room code provided by your host to join the exam session.</p>
            <input
                type="text"
                placeholder="e.g. AD1234"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
            />
            <button onClick={handleJoin}>Join</button>
            {error && <p>{error}</p>}
        </>
    )
}