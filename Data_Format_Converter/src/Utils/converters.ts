import Papa from 'papaparse';
import { js2xml, xml2js } from 'xml-js';
// import * as XLSX from 'xlsx';
import * as yaml from 'js-yaml';
import { Builder } from 'xml2js';

// JSON a XML
export const convertJsonToXml = (jsonString: string): string => {
    const json = JSON.parse(jsonString);
    return js2xml(json, { compact: true, spaces: 2 });
}

// JSON a CSV
export const convertJsonToCsv = (jsonContent: string) => {
    try {
        let jsonData = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;

        // Si jsonData no es un array, intentamos buscar el primer array dentro del objeto
        if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
            const firstArray = Object.values(jsonData).find(value => Array.isArray(value));
            if (firstArray) jsonData = firstArray;
        }

        if (!Array.isArray(jsonData)) {
            throw new Error('El JSON debe ser un array de objetos');
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

// JSON a YAML
export const convertJsonToYaml = (jsonString: string): string => {
    try {
        const jsonData = JSON.parse(jsonString);
        return yaml.dump(jsonData);
    } catch (error) {
        console.error('Error converting JSON to YAML:', error);
        throw error;
    }
};

// CSV a XML
export const convertCsvToXml = (csvString: string): string => {
    const json = Papa.parse(csvString, { header: true }).data;
    return js2xml(json, { compact: true, spaces: 2 });
}

// CSV a JSON
export const convertCsvToJson = (csvContent: string) => {
    try {
        // Divide el contenido en filas
        const rows = csvContent.trim().split('\n');

        // Divide la primera fila para obtener los encabezados
        const headers = rows[0].split(',');

        // Mapea cada fila a un objeto JSON
        const jsonData = rows.slice(1).map(row => {
            const values = row.split(',');
            // Combina encabezados y valores en un objeto
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

// CSV a YAML
export const convertCsvToYaml = (csvString: string): string => {
    try {
        // Convert CSV to JSON
        const jsonData = convertCsvToJson(csvString);

        // Convert JSON to YAML
        return convertJsonToYaml(JSON.stringify(jsonData, null, 2));
    } catch (error) {
        console.error('Error converting CSV to YAML:', error);
        throw error;
    }
};

// XML a JSON
// export const convertXmlToJson2 = (xmlString: string): string => {
//     const result = xml2js(xmlString, { compact: true });
//     return JSON.stringify(result, null, 2);
// }

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
    
    // Encuentra el primer array de objetos en el JSON resultante
    const arrays = extractArrays(result);

    // Aplanar cada objeto en el array y convertir a cadena JSON
    const jsonResult = arrays.map(flattenObject);
    return JSON.stringify(jsonResult, null, 2);
};

// XML a CSV
// utiliza de xml a json y de json a csv

// XML a YAML
export const convertXmlToYaml = async (xmlString: string): Promise<string> => {
    try {
        // Convert XML to JSON
        const jsonData = await convertXmlToJson(xmlString);

        // Convert JSON to YAML
        return convertJsonToYaml(JSON.stringify(jsonData, null, 2));
    } catch (error) {
        console.error('Error converting XML to YAML:', error);
        throw error;
    }
};

// YAML a JSON
export const convertYamlToJson = (yamlContent: string): string => {
    try {
        const jsonData = yaml.load(yamlContent);
        return JSON.stringify(jsonData, null, 2);
    } catch (error) {
        console.error('Error converting YAML to JSON:', error);
        throw error;
    }
};

// YAML a XML
export const convertYamlToXml = async (yamlContent: string): Promise<string> => {
    try {
        // Convierte YAML a JSON
        const jsonData = yaml.load(yamlContent);

        // Convierte JSON a XML
        const builder = new Builder();
        const xmlData = builder.buildObject(jsonData);

        return xmlData;
    } catch (error) {
        console.error('Error converting YAML to XML:', error);
        throw error;
    }
};

// YAML a CSV
// utiliza convertYamlToJson y convertJsonToCsv para hacerlo






