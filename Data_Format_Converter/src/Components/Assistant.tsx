import React, { useState } from 'react';
import { Modal } from 'antd';

const Assistant: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
    const [step, setStep] = useState(0);

    const steps = [
        'Step 1: Select the source file format.',
        'Step 2: Upload your file using the "Select File" button.',
        'Step 1: Select the source destination file format.',
        'Step 3: Check the file preview before converting.',
        'Step 4: Download or copy the converted file.'
    ];

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <Modal
            title="Conversion Assitant"
            open={isVisible}
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
