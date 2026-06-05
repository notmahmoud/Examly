import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase.js';
import { ref, onValue } from 'firebase/database';
import { auth } from '../firebase.js';
import { update, onDisconnect } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
export function LobbyPage() {
    const { roomCode } = useParams();
    const [participants, setParticipants] = useState({});
    const [roomData, setRoomData] = useState(null);
    const navigate = useNavigate();
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        const roomRef = ref(db, 'rooms/' + roomCode);
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setParticipants(data.participants || {});
                setRoomData(data);
                const currentIsHost = auth.currentUser?.uid === data.hostId;
                setIsHost(currentIsHost);
        
                // If room is public = start immediately
                if (data.isPublic && !currentIsHost) {
                    update(ref(db, 'rooms/' + roomCode), { status: 'active' });
                    navigate('/exam/' + roomCode);
                    return;
                }
                // If room becomes active and user is not host, navigate to exam page
                if (data.status === 'active' && !currentIsHost) {
                    navigate('/exam/' + roomCode);
                }
            }
        });
        return () => unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode]);

    // Add participant to room on join
    useEffect(() => {
        if (!auth.currentUser) return;
        if (roomData && !isHost) {
            const participantRef = ref(db, 'rooms/' + roomCode + '/participants/' + auth.currentUser.uid);

            update(participantRef, {
                name: auth.currentUser.displayName,
                status: 'joined'
            });
            onDisconnect(participantRef).update({ status: 'disconnected' });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHost, roomData]);

    const handleStartExam = () => {
        if (roomData && isHost) {
            update(ref(db, 'rooms/' + roomCode), { status: 'active' });
        }
    };

    return (
        <div>
            {isHost ? (
                <div>
                    <h1>Host Lobby</h1>
                    <p>Waiting for students to join your quiz room.</p>
                    <h1>Lobby: {roomCode}</h1>
                    {participants && <p>{Object.keys(participants).length} Participants joined</p>}
                    <button onClick={handleStartExam}>Start Exam</button>
                    <ul>
                        {Object.values(participants).map((participant) => (
                            <li key={participant.name}>
                                {participant.name} — {participant.status}
                                {participant.status === 'finished' && (
                                    <button onClick={() => navigate('/host-results/' + roomCode + '/' + participant.name)}>
                                        View Report
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                    {Object.keys(participants).length === 0 && <>
                        <h2>Waiting for the first student...</h2>
                        <p>Share the room code above with your students.</p>
                    </>}
                </div>
            ) : (
                <div>
                    <h2>Waiting for host to start the exam...</h2>
                </div>
            )}
        </div>
    );
}