import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';

export function useJoinExam() {
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleJoin = async () => {
        try {
            const roomRef = ref(db, 'rooms/' + roomCode);
            const snapshot = await get(roomRef);
            const data = snapshot.val();
            if (data) {
                if (data.isPublic) {
                    navigate('/exam/' + roomCode, { replace: true });
                } else {
                    navigate('/lobby/' + roomCode, { replace: true });
                }
            } else {
                setError('Room not found. Please check the code and try again.');
            }
        } catch {
            setError('Something went wrong. Please check your connection and try again.');
        }
    };
    return { roomCode, setRoomCode, error, handleJoin };
}
