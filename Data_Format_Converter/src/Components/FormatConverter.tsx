import React, { useEffect, useState } from 'react';
import {
    convertJsonToCsv,
    convertCsvToJson,
    convertXmlToJson,
    convertJsonToXml,
    convertCsvToXml,
    convertYamlToJson,
    convertYamlToXml,
    convertJsonToYaml,
    convertXmlToYaml,
    convertCsvToYaml,
} from '../Utils/converters';

interface FormatConverterProps {
    fileContent: string | ArrayBuffer;
    fileType: string;
    onConversion: (result: string) => void;
    onTargetFormatChange: (targetFormat: string) => void;
}

const FormatConverter: React.FC<FormatConverterProps> = ({ fileContent, fileType, onConversion, onTargetFormatChange }) => {
    const [targetFormat, setTargetFormat] = useState<string>('csv');

    useEffect(() => {
        onTargetFormatChange(targetFormat);
    }, [targetFormat, onTargetFormatChange]);

    const handleConversion = async () => {
        try {
            let result: string | ArrayBuffer = '';
            if (fileType === 'json') {
                if (targetFormat === 'csv') {
                    result = convertJsonToCsv(fileContent as string);
                } else if (targetFormat === 'xml') {
                    result = convertJsonToXml(fileContent as string);
                } else if (targetFormat === 'yaml') {
                    result = convertJsonToYaml(fileContent as string);
                }

            } else if (fileType === 'csv') {
                if (targetFormat === 'json') {
                    const jsonResult = convertCsvToJson(fileContent as string);
                    result = JSON.stringify(jsonResult, null, 2);
                } else if (targetFormat === 'xml') {
                    result = convertCsvToXml(fileContent as string);
                } else if (targetFormat === 'yaml') {
                    result = convertCsvToYaml(fileContent as string);
                }

            } else if (fileType === 'xml') {
                if (targetFormat === 'json') {
                    result = convertXmlToJson(fileContent as string);
                } else if (targetFormat === 'csv') {
                    const jsonResult = convertXmlToJson(fileContent as string);                    
                    result = convertJsonToCsv(jsonResult);
                } else if (targetFormat === 'yaml') {
                    result = await convertXmlToYaml(fileContent as string);
                }

            } else if (fileType === 'yaml' || fileType === 'yml') {
                if (targetFormat === 'json') {
                    result = convertYamlToJson(fileContent as string);
                } else if (targetFormat === 'xml') {
                    result = await convertYamlToXml(fileContent as string);
                } else if (targetFormat === 'csv') {
                    const jsonResult = convertYamlToJson(fileContent as string);
                    result = convertJsonToCsv(jsonResult);
                }
            }

            onConversion(result as string);

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
                <option value="yaml">YAML</option>
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
