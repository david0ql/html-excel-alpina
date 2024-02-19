const fs = require('fs');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Lee el contenido del archivo HTML
const html = fs.readFileSync('index.html', 'utf-8');

// Usa cheerio para cargar el HTML
const $ = cheerio.load(html);

// Encuentra todos los elementos tr dentro del tbody
const rows = $('tbody tr');

// Define las columnas para el archivo CSV
const csvColumns = [
  { id: 'companyName', title: 'Company name' },
  { id: 'address', title: 'Address' },
  { id: 'city', title: 'City' },
  { id: 'state', title: 'State' },
  { id: 'zip', title: 'Zip' },
  { id: 'sicCode', title: 'SIC code' },
  { id: 'recordDate', title: 'Record date' },
  { id: 'jurisdiction', title: 'Jurisdiction' },
];

// Crea un objeto CSV Writer con las columnas definidas
const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: csvColumns,
});

// Almacena los datos de cada fila
const records = [];

// Itera sobre cada fila y extrae los datos
rows.each((index, row) => {
  const rowData = {};
  $(row)
    .find('td.vgt-left-align span')
    .each((i, span) => {
      const columnName = csvColumns[i].id;
      rowData[columnName] = $(span).text().trim();
    });
  records.push(rowData);
});

// Escribe los datos en el archivo CSV
csvWriter.writeRecords(records)
  .then(() => console.log('CSV file written successfully'))
  .catch((err) => console.error(err));
