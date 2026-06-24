import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, update, onDisconnect } from 'firebase/database';
import { db, auth } from '../services/firebase';

export function useLobbyPage() {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [participants, setParticipants] = useState({});
    const [roomData, setRoomData] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

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

    // Warn before unload for host
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isHost && roomData && roomData.status !== 'active') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isHost, roomData]);

    const handleStartExam = () => {
        if (roomData && isHost) {
            update(ref(db, 'rooms/' + roomCode), { status: 'active' });
        }
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
    };

    return {
        roomCode,
        participants,
        roomData,
        isHost,
        showLeaveModal,
        setShowLeaveModal,
        handleStartExam,
        copyRoomCode,
        navigate
    };
}
