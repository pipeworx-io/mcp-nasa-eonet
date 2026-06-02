# mcp-nasa-eonet

NASA EONET MCP — Earth Observatory Natural Event Tracker

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `events` | List natural events (active / closed) with category, geometry, and source links. |
| `get_event` | Fetch a single event by EONET id. |
| `geojson` | Same as events but returns GeoJSON FeatureCollection (good for direct map rendering). |
| `list_categories` | EONET category reference. |
| `list_sources` | Official sources EONET aggregates. |
| `list_layers` | Visualization layer reference (mapping the events to imagery layers). |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
