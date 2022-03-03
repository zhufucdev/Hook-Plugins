# Hook-Plugins
Official collection of Hook plugins.

## [AutoPlay](AutoPlay)
> Fetch documents remotely from a HTTP server.

Dependency: [FitZoom](FitZoom)

License: _GPL v3_

The server is expected to implement the following GET methods:
- `/list` that returns a JSON array, whose items are objects that each contains `name` and `modified` properties.
- `/query/{name}` to download the file

## [FitZoom](FitZoom)
> Apply default zoom factor to the page, and make it more user-friendly for touchscreen users.

License: _GPL v3_

## [TouchBrush](TouchBrush)
> Highlight invisible white text with a click.

License: _GPL v3_