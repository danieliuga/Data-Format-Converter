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

const convertFile = async (fileContent: string | ArrayBuffer, fileType: string, targetFormat: string): Promise<string> => {
    const contentString = typeof fileContent === 'string' 
        ? fileContent 
        : new TextDecoder().decode(fileContent);

    try {
        if (fileType === 'json') {
            if (targetFormat === 'csv') {
                return convertJsonToCsv(contentString);
            } else if (targetFormat === 'xml') {
                return convertJsonToXml(contentString);
            } else if (targetFormat === 'yaml') {
                return convertJsonToYaml(contentString);
            }
        } else if (fileType === 'csv') {
            if (targetFormat === 'json') {
                return JSON.stringify(convertCsvToJson(contentString), null, 2);
            } else if (targetFormat === 'xml') {
                return convertCsvToXml(contentString);
            } else if (targetFormat === 'yaml') {
                return convertCsvToYaml(contentString);
            }
        } else if (fileType === 'xml') {
            if (targetFormat === 'json') {
                return convertXmlToJson(contentString);
            } else if (targetFormat === 'csv') {
                return convertJsonToCsv(convertXmlToJson(contentString));
            } else if (targetFormat === 'yaml') {
                return await convertXmlToYaml(contentString);
            }
        } else if (fileType === 'yaml' || fileType === 'yml') {
            if (targetFormat === 'json') {
                return convertYamlToJson(contentString);
            } else if (targetFormat === 'xml') {
                return await convertYamlToXml(contentString);
            } else if (targetFormat === 'csv') {
                return convertJsonToCsv(convertYamlToJson(contentString));
            }
        }
        throw new Error('Unsupported conversion');
    } catch (error) {
        console.error('Error during conversion:', error);
        return 'Error during conversion';
    }
};

const FormatConverter: React.FC<FormatConverterProps> = ({ fileContent, fileType, onConversion, onTargetFormatChange }) => {
    const [targetFormat, setTargetFormat] = useState<string>('csv');

    const formats = ['json', 'csv', 'xml', 'yaml'];

    const availableFormats = formats.filter((format) => format !== fileType);

    useEffect(() => {
        onTargetFormatChange(targetFormat);
    }, [targetFormat, onTargetFormatChange]);

    useEffect(() => {
        if (fileContent && fileType) {
            convertFile(fileContent, fileType, targetFormat).then(onConversion);
        }
    }, [fileContent, fileType, targetFormat, onConversion]);

    return (
        <div>
            <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
                {availableFormats.map((format) => (
                    <option key={format} value={format}>
                        {format.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormatConverter;
