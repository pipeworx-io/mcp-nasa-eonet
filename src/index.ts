interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * NASA EONET MCP — Earth Observatory Natural Event Tracker
 *
 * Auth: none.
 * Docs: https://eonet.gsfc.nasa.gov/docs/v3
 */


const BASE = 'https://eonet.gsfc.nasa.gov/api/v3';

const tools: McpToolExport['tools'] = [
  {
    name: 'events',
    description: 'List natural events (active / closed) with category, geometry, and source links.',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'open (default) | closed | all' },
        days: { type: 'number', description: 'Lookback window in days (default 30, default 30 for closed)' },
        source: { type: 'string', description: 'Comma-sep source ids (see list_sources)' },
        category: { type: 'string', description: 'Comma-sep category ids (e.g. "wildfires,severeStorms")' },
        bbox: { type: 'string', description: 'Bounding box: "min_lon,max_lat,max_lon,min_lat" (note non-standard order)' },
        limit: { type: 'number', description: 'Max results' },
        magnitude_id: { type: 'string', description: 'Filter by magnitude id (e.g. "ac" for acres)' },
        magnitude_min: { type: 'number', description: 'Minimum magnitude' },
        magnitude_max: { type: 'number', description: 'Maximum magnitude' },
      },
    },
  },
  {
    name: 'get_event',
    description: 'Fetch a single event by EONET id.',
    inputSchema: {
      type: 'object',
      properties: { event_id: { type: 'string', description: 'EONET event id (e.g. "EONET_6210")' } },
      required: ['event_id'],
    },
  },
  {
    name: 'geojson',
    description: 'Same as events but returns GeoJSON FeatureCollection (good for direct map rendering).',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        days: { type: 'number' },
        category: { type: 'string' },
        bbox: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
  {
    name: 'list_categories',
    description: 'EONET category reference.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_sources',
    description: 'Official sources EONET aggregates.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_layers',
    description: 'Visualization layer reference (mapping the events to imagery layers).',
    inputSchema: {
      type: 'object',
      properties: { category: { type: 'string', description: 'Restrict to one category' } },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'events': {
      const params = buildCommon(args);
      if (args.magnitude_id) params.set('magID', String(args.magnitude_id));
      if (args.magnitude_min !== undefined) params.set('magMin', String(args.magnitude_min));
      if (args.magnitude_max !== undefined) params.set('magMax', String(args.magnitude_max));
      return eonetGet(`/events?${params}`);
    }
    case 'get_event':
      return eonetGet(`/events/${encodeURIComponent(reqStr(args, 'event_id', '"EONET_6210"'))}`);
    case 'geojson':
      return eonetGet(`/events/geojson?${buildCommon(args)}`);
    case 'list_categories':
      return eonetGet('/categories');
    case 'list_sources':
      return eonetGet('/sources');
    case 'list_layers': {
      const cat = (args.category as string | undefined)?.trim();
      return cat ? eonetGet(`/layers/${encodeURIComponent(cat)}`) : eonetGet('/layers');
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function buildCommon(args: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  if (args.status) params.set('status', String(args.status));
  if (args.days !== undefined) params.set('days', String(args.days));
  if (args.source) params.set('source', String(args.source));
  if (args.category) params.set('category', String(args.category));
  if (args.bbox) params.set('bbox', String(args.bbox));
  if (args.limit !== undefined) params.set('limit', String(args.limit));
  return params;
}

async function eonetGet(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-nasa-eonet/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error('NASA EONET: not found');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`NASA EONET error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
