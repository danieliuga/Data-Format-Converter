import React, { useEffect, useState } from 'react';
import { convertJsonToCsv, convertCsvToJson, convertXmlToJson, convertJsonToXml, convertCsvToXml, convertXmlToCsv, convertJsonToXlsx } from '../Utils/converters';

interface FormatConverterProps {
    fileContent: string;
    fileType: string;
    onConversion: (result: string) => void;
    onTargetFormatChange: (targetFormat: string) => void;
}

const FormatConverter: React.FC<FormatConverterProps> = ({ fileContent, fileType, onConversion, onTargetFormatChange }) => {
    const [targetFormat, setTargetFormat] = useState<string>('csv');

    useEffect(() => {
        onTargetFormatChange(targetFormat);
    }, [targetFormat, onTargetFormatChange]);

    const handleConversion = () => {
        try {
            let result = '';
            if (fileType === 'json') {
                if (targetFormat === 'csv') result = convertJsonToCsv(fileContent);
                else if (targetFormat === 'xml') result = convertJsonToXml(fileContent);
                else if (targetFormat === 'xlsx') result = convertJsonToXlsx(fileContent);
            } else if (fileType === 'csv') {
                if (targetFormat === 'json') result = convertCsvToJson(fileContent);
                else if (targetFormat === 'xml') result = convertCsvToXml(fileContent);
            } else if (fileType === 'xml') {
                if (targetFormat === 'json') result = convertXmlToJson(fileContent);
                else if (targetFormat === 'csv') result = convertXmlToCsv(fileContent);
            }
            onConversion(result);

        } catch (error) {
            console.error('Error during conversion:', error);
            onConversion('Error during conversion');
        }
    };

    return (
        <div>
            <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
                <option value="xlsx">Excel (XLSX)</option>
            </select>
            <button
                onClick={handleConversion}
                disabled={!fileContent}
            >
                Convert
            </button>
        </div>
    );
};

export default FormatConverter;
