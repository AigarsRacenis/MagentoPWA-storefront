const fs = require('fs');
const path = require('path');

const CONFIG_FILE_NAME = 'override.json';

class Config {
    /**
     * Parse config file to an object
     * @returns {{}|any}
     */
    static getConfig() {
        const filePath = path.resolve(process.cwd(), CONFIG_FILE_NAME);
        const stat = fs.statSync(filePath);

        if (stat && stat.isFile()) {
            return JSON.parse(fs.readFileSync(filePath).toString());
        }

        return {};
    }
}

module.exports = Config;
