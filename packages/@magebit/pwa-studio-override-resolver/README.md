Allows overriding files from @magento packages.

Create `override.json` in the root of your project and configure paths.

Example configuration:
```
{
    "overridePaths": {
        "src/overrides/venia-ui/components": "@magento/venia-ui/lib/components"
    }
}
```
