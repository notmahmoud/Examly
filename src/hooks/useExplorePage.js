import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { ref, get } from 'firebase/database';

export const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200',
};

export function useExplorePage() {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPublicRooms = async () => {
            try {
                const snapshot = await get(ref(db, 'publicRooms'));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const roomsArray = Object.entries(data).map(
                        ([roomCode, room]) => ({ roomCode, ...room })
                    );
                    roomsArray.sort((a, b) => b.createdAt - a.createdAt);
                    setRooms(roomsArray);
                }
            } catch (err) {
                console.error('Firebase error:', err);
                setError(err.message || 'Failed to load rooms. Check database rules.');
            } finally {
                setLoading(false);
            }
        };

        fetchPublicRooms();
    }, []);

    const filteredRooms = rooms.filter(room =>
        room.examTitle?.toLowerCase().includes(search.toLowerCase())
    );

    return { search, setSearch, loading, error, filteredRooms };
}
