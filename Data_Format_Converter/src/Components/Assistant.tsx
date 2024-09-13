import React, { useEffect, useRef } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Assistant: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible }) => {
    const driverRef = useRef<any>(null);

    useEffect(() => {
        if (isVisible) {
            driverRef.current = driver({
                animate: true,
                showProgress: true,
                showButtons: ['next', 'previous', 'close'],
                
                steps: [
                    { element: '.uploadFile', popover: { title: 'Step 1', description: 'Select the source file format.', side: "left", align: 'start' } },
                    { element: '.uploadFile', popover: { title: 'Step 2', description: 'Upload your file using the "Select File" button.', side: "bottom", align: 'start' } },
                    { element: '.formatConverter', popover: { title: 'Step 3', description: 'Select the source destination file format.', side: "bottom", align: 'start' } },
                    { element: '.convertedOutput', popover: { title: 'Step 4', description: 'Check the file preview before copying or downloading.', side: "left", align: 'start' } },
                    { element: '.downloadButton', popover: { title: 'Step 5', description: 'Download the file.', side: "top", align: 'start' } },
                    { element: '.copyButton', popover: { title: 'Step 6', description: 'Copy the text of the file.', side: "right", align: 'start' } },
                    { popover: { title: 'Step 7', description: 'And that is all, go ahead and enjoy the Data Format Converter by Daniel Iuga.' } }
                ],
            });

            driverRef.current.drive();

            return () => {
                driverRef.current?.destroy();
                driverRef.current = null;
            };
        } else {
            driverRef.current?.destroy();
        }

    }, [isVisible]);

    return null;
};

export default Assistant;
