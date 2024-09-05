import React, { useState } from 'react';
import { Modal } from 'antd';

const Assistant: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
    const [step, setStep] = useState(0);

    const steps = [
        'Step 1: Selecciona el formato de archivo de origen.',
        'Step 2: Sube tu archivo utilizando el botón "Seleccionar Archivo".',
        'Step 1: Selecciona el formato de archivo de origen destino.',
        'Step 3: Revisa la vista previa del archivo antes de convertirlo.',
        'Step 4: Download or copy the converted file.'
    ];

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <Modal
            title="Conversion Assitant"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
        >
            <p>{steps[step]}</p>
            <div>
                <button onClick={prevStep} disabled={step === 0}>Previous</button>
                <button onClick={nextStep} disabled={step === steps.length - 1} style={{ marginLeft: 8 }}>Next</button>
                <button onClick={onClose} style={{ marginLeft: 8 }}>Close</button>
            </div>
        </Modal>
    )
}

export default Assistant;
