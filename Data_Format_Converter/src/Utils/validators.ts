import Papa from 'papaparse';

export const validateCSV = (csvText: string): boolean => {
  let isValid = true;
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      console.log('Parsed Results:', results);
      // Implement validation logic here
    },
    error: () => {
      isValid = false;
    }
  });
  return isValid;
};

export const validateJSON = (jsonText: string): boolean => {
    try {
        JSON.parse(jsonText);
        return true;
    } catch (e) {
        return false;
    }
};
