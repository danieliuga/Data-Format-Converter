import Papa from 'papaparse';
import { js2xml, xml2js } from 'xml-js';
import * as yaml from 'js-yaml';
import { Builder } from 'xml2js';

export const convertJsonToXml = (jsonString: string): string => {
    const json = JSON.parse(jsonString);
    return js2xml(json, { compact: true, spaces: 2 });
}

export const convertJsonToCsv = (jsonContent: string) => {
    try {
        let jsonData = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;

        if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
            const firstArray = Object.values(jsonData).find(value => Array.isArray(value));
            if (firstArray) {
                jsonData = firstArray;
            } else {
                jsonData = [jsonData];
            }
        }

        if (!Array.isArray(jsonData)) {
            throw new Error('El JSON debe ser un array de objetos o un objeto individual.');
        }

        const headers = Object.keys(jsonData[0]);

        const csvRows = jsonData.map(obj =>
            headers.map(header =>
                JSON.stringify(obj[header] || '')
            ).join(',')
        );

        const csvContent = [headers.join(','), ...csvRows].join('\n');

        return csvContent;

    } catch (error) {
        console.error('Error converting JSON to CSV:', error);
        throw error;
    }
};


export const convertJsonToYaml = (jsonString: string): string => {
    try {
        const jsonData = JSON.parse(jsonString);
        return yaml.dump(jsonData);
    } catch (error) {
        console.error('Error converting JSON to YAML:', error);
        throw error;
    }
};

export const convertCsvToXml = (csvString: string): string => {
    const json = Papa.parse(csvString, { header: true }).data;
    return js2xml(json, { compact: true, spaces: 2 });
}

export const convertCsvToJson = (csvContent: string) => {
    try {
        const rows = csvContent.trim().split('\n');

        const headers = rows[0].split(',');

        const jsonData = rows.slice(1).map(row => {
            const values = row.split(',');
            const obj: { [key: string]: any } = {};
            headers.forEach((header, index) => {
                obj[header.trim()] = values[index].trim();
            });
            return obj;
        });

        return jsonData;

    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error;
    }
};

export const convertCsvToYaml = (csvString: string): string => {
    try {
        const jsonData = convertCsvToJson(csvString);

        return convertJsonToYaml(JSON.stringify(jsonData, null, 2));
    } catch (error) {
        console.error('Error converting CSV to YAML:', error);
        throw error;
    }
};

const flattenObject = (obj: any): any => {
    let result: any = {};
    for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object' && '_text' in obj[key]) {
            result[key] = obj[key]._text;
        } else if (obj[key] && typeof obj[key] === 'object') {
            const flatObject = flattenObject(obj[key]);
            for (let subKey in flatObject) {
                result[`${key}_${subKey}`] = flatObject[subKey];
            }
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};

const extractArrays = (obj: any): any[] => {
    let result: any[] = [];
    if (Array.isArray(obj)) {
        result = obj;
    } else if (typeof obj === 'object') {
        for (let key in obj) {
            if (Array.isArray(obj[key])) {
                result = result.concat(obj[key]);
            } else if (typeof obj[key] === 'object') {
                result = result.concat(extractArrays(obj[key]));
            }
        }
    }
    return result;
};

export const convertXmlToJson = (xmlString: string): string => {
    const result = xml2js(xmlString, { compact: true });
    
    const arrays = extractArrays(result);

    const jsonResult = arrays.map(flattenObject);
    return JSON.stringify(jsonResult, null, 2);
};

export const convertXmlToYaml = async (xmlString: string): Promise<string> => {
    try {
        const jsonData = convertXmlToJson(xmlString);

        return convertJsonToYaml(JSON.stringify(jsonData, null, 2));
    } catch (error) {
        console.error('Error converting XML to YAML:', error);
        throw error;
    }
};

export const convertYamlToJson = (yamlContent: string): string => {
    try {
        const jsonData = yaml.load(yamlContent);
        return JSON.stringify(jsonData, null, 2);
    } catch (error) {
        console.error('Error converting YAML to JSON:', error);
        throw error;
    }
};

export const convertYamlToXml = async (yamlContent: string): Promise<string> => {
    try {
        const jsonData = yaml.load(yamlContent);

        const builder = new Builder();
        const xmlData = builder.buildObject(jsonData);

        return xmlData;
    } catch (error) {
        console.error('Error converting YAML to XML:', error);
        throw error;
    }
};
