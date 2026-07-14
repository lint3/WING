const SVG_NS = 'http://www.w3.org/2000/svg';

export function renderPage(resolvedPage) {
  const { properties: p } = resolvedPage;
  const width = p.page_width || 11;
  const height = p.page_height || 8.5;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('xmlns', SVG_NS);
  svg.setAttribute('width', `${width}in`);
  svg.setAttribute('height', `${height}in`);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  if (p.page_background) {
    const bg = el('rect');
    setAttrs(bg, { x: 0, y: 0, width, height, fill: p.page_background });
    svg.appendChild(bg);
  }

  for (const [name, elem] of Object.entries(resolvedPage.elements)) {
    const node = renderElement(elem, p);
    if (node) {
      node.setAttribute('data-element-name', name);
      svg.appendChild(node);
    }
  }

  return svg;
}

function renderElement(el, defaults) {
  switch (el.type) {
    case 'rectangle': return renderRect(el, defaults);
    case 'ellipse':   return renderEllipse(el, defaults);
    case 'text':      return renderText(el, defaults);
    case 'rich_text': return renderRichText(el, defaults);
    case 'image':     return renderImage(el, defaults);
    default:
      console.warn('Unknown element type:', el.type);
      return null;
  }
}

function renderRect(el, defaults) {
  const rect = el('rect');
  setAttrs(rect, {
    x: el.loc[0], y: el.loc[1],
    width: el.dims[0], height: el.dims[1],
    fill: el.fill_color || defaults.fill_color || 'none',
    stroke: el.line_color || defaults.line_color || '#000000',
    'stroke-width': toPt(el.line_thickness_pt ?? defaults.line_thickness_pt ?? 1),
  });
  return rect;
}

function renderEllipse(el, defaults) {
  const e = el('ellipse');
  setAttrs(e, {
    cx: el.loc[0] + el.dims[0] / 2,
    cy: el.loc[1] + el.dims[1] / 2,
    rx: el.dims[0] / 2,
    ry: el.dims[1] / 2,
    fill: el.fill_color || defaults.fill_color || 'none',
    stroke: el.line_color || defaults.line_color || '#000000',
    'stroke-width': toPt(el.line_thickness_pt ?? defaults.line_thickness_pt ?? 1),
  });
  return e;
}

function renderText(el, defaults) {
  const text = el('text');
  const fontSize = el.font_size_pt ?? defaults.font_size_pt ?? 12;

  setAttrs(text, {
    x: el.loc[0],
    y: el.loc[1],
    'font-size': `${fontSize}pt`,
    'font-family': el.font || defaults.font || 'sans-serif',
    fill: el.font_color || defaults.font_color || '#000000',
  });

  const content = el.content != null ? String(el.content) : '';
  const lines = content.split('\n');

  text.setAttribute('dominant-baseline', 'hanging');

  for (let i = 0; i < lines.length; i++) {
    const tspan = el('tspan');
    tspan.setAttribute('x', el.loc[0]);
    if (i > 0) tspan.setAttribute('dy', `${fontSize * 1.2}pt`);
    tspan.textContent = lines[i];
    text.appendChild(tspan);
  }

  return text;
}

function renderRichText(el, defaults) {
  const fo = el('foreignObject');
  setAttrs(fo, {
    x: el.loc[0],
    y: el.loc[1],
    width: el.dims[0],
    height: el.dims[1],
  });

  const div = document.createElement('div');
  div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  div.innerHTML = el.content || '';
  div.style.fontSize = `${el.font_size_pt ?? defaults.font_size_pt ?? 12}pt`;
  div.style.fontFamily = el.font || defaults.font || 'sans-serif';
  div.style.color = el.font_color || defaults.font_color || '#000000';
  fo.appendChild(div);

  return fo;
}

function renderImage(el) {
  const img = el('image');
  setAttrs(img, {
    x: el.loc[0],
    y: el.loc[1],
    width: el.dims[0],
    height: el.dims[1],
  });
  if (el.src) {
    img.setAttribute('href', el.src);
  }
  return img;
}

function el(tag) {
  return document.createElementNS(SVG_NS, tag);
}

function setAttrs(node, attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    if (v != null && v !== '') node.setAttribute(k, v);
  }
}

function toPt(value) {
  if (value === 'hairline') return '0.5pt';
  return typeof value === 'number' ? `${value}pt` : String(value);
}
