# @pipeworx/nasa-eonet

NASA EONET MCP — Earth Observatory Natural Event Tracker. Wildfires, storms, volcanoes, icebergs, dust + haze, severe storms, snow, manmade events. Auto-curated from official sources. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `events(status?, days?, source?, category?, bbox?, limit?, magnitude_id?, magnitude_min?, magnitude_max?)` — events list
- `get_event(event_id)` — single event detail
- `geojson(status?, days?, category?, bbox?, limit?)` — events as GeoJSON FeatureCollection
- `list_categories()` — category reference
- `list_sources()` — official data sources EONET aggregates
- `list_layers(category?)` — visualization layer reference

## Data source

`https://eonet.gsfc.nasa.gov/api/v3/` — public NASA Goddard service.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "nasa-eonet": {
      "url": "https://gateway.pipeworx.io/nasa-eonet/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Nasa Eonet data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
