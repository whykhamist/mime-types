# 1.1.1 / 2025-12-16
    - Updated the regex pattern to correctly handle multiple wildcards in MIME type matching by replacing all '*' characters with the appropriate regex expression.
    - Update Readme.md

# 1.1.0 / 2025-12-15

    - Upgrade dependencies
    - Integrate jshttp/mime-types#119
        - Resolves extension conflicts with mime-score
        - Improved facet prefix extraction
    - Improve extension lookup using wild card mime types
    - Add the `getExtensions(...)` function that lists all possible extensions for mime types
    - Add extension scoring (similar to `mime-score`) to determine the best extension for a mime-type
    - Move score tables to a separate module
    - Update unit tests

# 1.0.4 / 2025-10-20

    - Upgrade dependencies

# 1.0.3 / 2025-02-19

    - Upgrade dependencies
    - Update package.json (Resolve build warnings)

# 1.0.2 / 2024-08-02

    - Readme update
    - Updated import and exports
    - moved MimeTypes instance to a separate module
    - private function extname updated.
        - Moved regex code outside to its own variable

# 1.0.1 / 2024-07-30

    - Config update

# 1.0.0 / 2024-07-29

    Initial Release
    - Written in typescript
    - Change function names
        - lookup        ⇨ getMime
        - contentType   ⇨ getContentType
        - extension     ⇨ getExtension
        - charset       ⇨ getCharset
    - Add new function
        - getMimes
