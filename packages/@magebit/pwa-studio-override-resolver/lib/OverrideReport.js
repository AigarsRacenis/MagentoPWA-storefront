const overrides = {};
let isReported = false;

class OverrideReport {
    /**
     * @param originalPath
     * @param overridePath
     */
    static addOverrideLog(originalPath, overridePath) {
        Object.assign(overrides, {
            [originalPath.replace(process.cwd(), '')]: overridePath.replace(process.cwd(), '')
        });
    }

    /**
     * @returns {string}
     */
    static getOverrideReport() {
        if (isReported) {
            return '';
        }

        isReported = true;
        const overrideReport = Object.keys(overrides).map(originalPath => `${originalPath} => ${overrides[originalPath]}`).join('\n');

        return `\n${overrideReport}`;
    };

    static isReported() {
        return !Object.keys(overrides).length || isReported;
    }
}

module.exports = OverrideReport;
