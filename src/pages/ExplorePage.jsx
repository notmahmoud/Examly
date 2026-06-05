import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export function ExplorePage() {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublicRooms = async () => {
            try {
                const snapshot = await get(ref(db, 'publicRooms'));

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    const roomsArray = Object.entries(data).map(
                        ([roomCode, room]) => ({
                            roomCode,
                            ...room
                        })
                    );

                    roomsArray.sort(
                        (a, b) => b.createdAt - a.createdAt
                    );

                    setRooms(roomsArray);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicRooms();
    }, []);

    const filteredRooms = rooms.filter(room =>
        room.examTitle
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {
        return <p>Loading public exams...</p>;
    }

    return (
        <div>
            <h1>Explore Exams</h1>

            <input
                type="text"
                placeholder="Search exam..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {filteredRooms.length > 0 && (
                <p>{filteredRooms.length} results found</p>
            )}
            {filteredRooms.length === 0 && (
                <p>No public exams found.</p>
            )}

            {filteredRooms.map(room => (
                <div
                    key={room.roomCode}
                    style={{
                        border: '1px solid gray',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}
                >
                    <h2>{room.examTitle}</h2>

                    <p>
                        {room.examDescription ||
                            'No description'}
                    </p>

                    <p>
                        Difficulty: {room.difficulty}
                    </p>

                    <p>
                        Questions: {room.questionsCount}
                    </p>

                    <button
                        onClick={() =>
                            navigate(`/exam/${room.roomCode}`)
                        }
                    >
                        Join Exam
                    </button>
                </div>
            ))}
        </div>
    );
}