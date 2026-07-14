export function parseDocument(state) {
  const templateFile = state.getParsed('document_template.json');
  const dataFile = state.getParsed('document_data.json');

  const nodeMap = {};

  if (templateFile && templateFile.page_templates) {
    for (const [id, tmpl] of Object.entries(templateFile.page_templates)) {
      nodeMap[id] = { type: 'template', id, parent: tmpl.parent || null, data: tmpl };
    }
  }

  const pages = [];
  if (dataFile && Array.isArray(dataFile.pages)) {
    for (const page of dataFile.pages) {
      nodeMap[page.id] = { type: 'page', id: page.id, parent: page.parent || null, data: page };
      pages.push(nodeMap[page.id]);
    }
  }

  const resolvedPages = pages.map((p) => resolvePage(p, nodeMap, dataFile.metadata || {}));

  return {
    resolvedPages,
    pageOrder: pages.map((p) => p.id),
    errors: [],
  };
}

function resolvePage(pageNode, nodeMap, metadata) {
  const chain = [];
  let current = nodeMap[pageNode.parent];
  while (current) {
    chain.unshift(current);
    current = current.parent ? nodeMap[current.parent] : null;
  }

  let properties = {};
  let elements = {};

  for (const tmpl of chain) {
    mergeNode(properties, elements, tmpl.data);
  }

  if (pageNode.data.extra_elements) {
    Object.assign(elements, pageNode.data.extra_elements);
  }

  const slotValues = { ...metadata };
  if (pageNode.data.slots) {
    Object.assign(slotValues, pageNode.data.slots);
  }

  for (const [, el] of Object.entries(elements)) {
    if (typeof el.content === 'string') {
      el.content = el.content.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        slotValues[key] != null ? slotValues[key] : `{{${key}}}`
      );
    }
  }

  return { pageId: pageNode.id, properties, elements };
}

function mergeNode(properties, elements, data) {
  for (const [key, val] of Object.entries(data)) {
    if (['parent', 'description', 'elements', 'slots', 'extra_vars'].includes(key)) continue;
    properties[key] = val;
  }
  if (data.elements) {
    Object.assign(elements, data.elements);
  }
}
