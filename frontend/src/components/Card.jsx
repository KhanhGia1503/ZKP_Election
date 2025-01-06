import React, { useState } from 'react';
import Modal from './Modal';

const Card = ({ voter }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="card">
            <h3>{voter.name}</h3>
            <button onClick={openModal}>Bầu cử</button>
            {isModalOpen && (
                <Modal voter={voter} onClose={closeModal} />
            )}
        </div>
    );
};

export default Card;