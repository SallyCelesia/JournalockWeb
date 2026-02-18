const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../Data/journalData.json');

function readData(){
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  }
  catch(err){
    console.log(err);
    return { journals: [] };
  }
}

function writeData(data){
  try {
    fs.writeFileSync(dataFilePath,JSON.stringify(data, null, 2));
    return true;
  }
  catch(err){
    console.log(err);
    return false;
  }
}

module.exports = { readData, writeData};