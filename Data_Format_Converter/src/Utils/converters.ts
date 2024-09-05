import Papa from 'papaparse';
import { js2xml, xml2js } from 'xml-js';
import { utils, write } from 'xlsx';
import * as yaml from 'js-yaml';

// JSON a CSV
export const convertJsonToCsv = (jsonString: string): string => {
    const json = JSON.parse(jsonString);
    return Papa.unparse(json);
}
// export const convertJsonToCsv = (json: string): string => {
//     const data = JSON.parse(json);
//     return utils.json_to_sheet(data).toString();
// };

// CSV a JSON
export const convertCsvToJson = (csvString: string): string => {
    const result = Papa.parse(csvString, { header: true });
    return JSON.stringify(result.data, null, 2);
}
// export const convertCsvToJson = (csv: string): string => {
//     const result = utils.sheet_to_json(utils.csv_to_sheet(csv));
//     return JSON.stringify(result);
// };

// XML a JSON
export const convertXmlToJson = (xmlString: string): string => {
    const result = xml2js(xmlString, { compact: true });
    return JSON.stringify(result, null, 2);
}
// export const convertXmlToJson = (xml: string): string => {
//     let jsonResult = '';
//     xml2js.parseString(xml, (err, result) => {
//         if (err) {
//             throw new Error('Error parsing XML');
//         }
//         jsonResult = JSON.stringify(result);
//     });
//     return jsonResult;
// };

// JSON a XML
export const convertJsonToXml = (jsonString: string): string => {
    const json = JSON.parse(jsonString);
    return js2xml(json, { compact: true, spaces: 2 });
}
// export const convertJsonToXml = (json: string): string => {
//     const jsonObject = JSON.parse(json);
//     const builder = new xml2js.Builder();
//     return builder.buildObject(jsonObject);
// };

// CSV a XML
export const convertCsvToXml = (csvString: string): string => {
    const json = Papa.parse(csvString, { header: true }).data;
    return js2xml(json, { compact: true, spaces: 2 });
}
// export const convertCsvToXml = (csv: string): string => {
//     const json = convertCsvToJson(csv);
//     return convertJsonToXml(json);
// };

// XML a CSV
export const convertXmlToCsv = (xmlString: string): string => {
    // Convert XML to JSON
    const json = xml2js(xmlString, { compact: true });

    // Flatten JSON if necessary
    const flattenJson = (obj: any): any[] => {
        const result: any[] = [];
        const flatten = (obj: any, parentKey: string = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const newKey = parentKey ? `${parentKey}.${key}` : key;
                if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                    flatten(value, newKey);
                } else {
                    result.push({ [newKey]: value });
                }
            }
        };
        flatten(obj);
        return result;
    };

    // Flatten JSON and convert to CSV
    const flattenedJson = flattenJson(json);
    return Papa.unparse(flattenedJson);
}
// export const convertXmlToCsv = (xml: string): string => {
//     const json = convertXmlToJson(xml);
//     return convertJsonToCsv(json);
// };

export const convertJsonToXlsx = (json: string): string => {
    const data = JSON.parse(json);
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    return write(wb, { type: 'binary', bookType: 'xlsx' });
};
