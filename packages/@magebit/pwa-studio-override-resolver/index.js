const path = require('path');
const { cachedCleverMerge } = require('webpack/lib/util/cleverMerge');
const Config = require('./lib/Config');
const PwaStudioOverrideResolverPlugin = require('./lib/PwaStudioOverrideResolverPlugin');
const OverrideReport = require('./lib/OverrideReport');

module.exports = targets => {
    const config = Config.getConfig();
    const overrideConfig = config['overridePaths'];

    if (overrideConfig) {
        // Collect override paths and create resolver objects
        const resolvers = [];
        Object.keys(overrideConfig).forEach(overridePath => {
            const originalPath = path.resolve('node_modules', overrideConfig[overridePath]);
            const name = overridePath.replace('/', '.').concat('.override.resolver');
            resolvers.push(
                new PwaStudioOverrideResolverPlugin({
                    name,
                    originalPath,
                    overridePath: path.resolve(overridePath),
                    addOverrideLog: OverrideReport.addOverrideLog
                })
            );
        });

        if (resolvers.length) {
            const webpackCompiler = targets.of('@magento/pwa-buildpack').webpackCompiler;
            webpackCompiler.tap(compiler =>
                compiler.resolverFactory.hooks.resolveOptions
                    .for('normal')
                    .tap('PwaStudioNormalOverrideResolverPlugin', resolveOptions => {
                        const plugin = Object.assign({ plugins: resolvers });
                        return cachedCleverMerge(plugin, resolveOptions);
                    })
            );
            webpackCompiler.tap(compiler =>
                compiler.resolverFactory.hooks.resolveOptions
                    .for('context')
                    .tap('PwaStudioContextOverrideResolverPlugin', resolveOptions => {
                        const plugin = Object.assign({ plugins: resolvers });
                        return cachedCleverMerge(plugin, resolveOptions);
                    })
            );
            webpackCompiler.tap(compiler => {
                compiler.hooks.done.tapPromise('PwaStudioOverrideReportPlugin', async () => {
                    if (OverrideReport.isReported()) {
                        return;
                    }
                    compiler.getInfrastructureLogger('pwa-studio-override-report').info(OverrideReport.getOverrideReport());
                });
            });
        }
    }
};
