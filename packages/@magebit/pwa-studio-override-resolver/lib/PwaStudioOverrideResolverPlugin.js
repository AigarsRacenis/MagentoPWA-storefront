const fs = require('fs');

class PwaStudioOverrideResolverPlugin {
    constructor(options) {
        this.name = options.name || 'PwaStudioOverrideResolverPlugin';
        this.originalPath = options.originalPath;
        this.overridePath = options.overridePath;
        this.addOverrideLog = options.addOverrideLog;
    }

    apply(resolver) {
        const target = resolver.ensureHook('resolved');
        resolver
            .getHook('existingFile')
            .tapAsync(this.name, (request, resolveContext, callback) => {
                const currentPath = request.path;
                if (!currentPath) {
                    return callback();
                }

                if (currentPath.startsWith(this.originalPath)) {
                    const overrideFilePath = currentPath.replace(this.originalPath, this.overridePath);
                    fs.stat(overrideFilePath, (err, stat) => {
                        if (!err && stat && stat.isFile()) {
                            const obj = {
                                ...request,
                                path: overrideFilePath,
                                request: undefined
                            };
                            this.addOverrideLog(currentPath, overrideFilePath);
                            return resolver.doResolve(
                                target,
                                obj,
                                `resolved by ${this.name} to ${overrideFilePath}`,
                                resolveContext,
                                callback
                            );
                        }
                        return callback();
                    });
                } else {
                    return callback();
                }
            });
    }
}

module.exports = PwaStudioOverrideResolverPlugin;
