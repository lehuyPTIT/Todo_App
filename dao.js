const fs = require("fs");
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
class DataAccessObject {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = null;
    }

    readData = async() => {
        try {
            let rawJson = await readFile(this.filePath, 'utf-8');
            this.data = JSON.parse(rawJson);
            return this.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    writeData = async() => {
        try {
            if (this.data !== null) {
                await writeFile(this.filePath, JSON.stringify(this.data), 'utf-8');
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

}

module.exports = DataAccessObject;