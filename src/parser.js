export function parseDocument(state) {
  const templateFile = state.getParsed('document_template.json');
  const dataFile = state.getParsed('document_data.json');

  console.group('parseDocument');
  console.log('templateFile present:', !!templateFile, 'dataFile present:', !!dataFile);

  const nodeMap = {};

  if (templateFile && templateFile.page_templates) {
    const tkeys = Object.keys(templateFile.page_templates);
    console.log('template IDs:', tkeys);
    for (const [id, tmpl] of Object.entries(templateFile.page_templates)) {
      nodeMap[id] = { type: 'template', id, parent: tmpl.parent || null, data: tmpl };
    }
  }

  const pages = [];
  if (dataFile && Array.isArray(dataFile.pages)) {
    console.log('page count:', dataFile.pages.length);
    for (const page of dataFile.pages) {
      console.log('  page:', page.id, '→ parent:', page.parent || '(none)');
      nodeMap[page.id] = { type: 'page', id: page.id, parent: page.parent || null, data: page };
      pages.push(nodeMap[page.id]);
    }
  }

  console.log('nodeMap keys:', Object.keys(nodeMap));

  const resolvedPages = pages.map((p) => {
    const resolved = resolvePage(p, nodeMap, dataFile.metadata || {});
    console.log('resolved page:', p.id, '| chain length:', resolved.chain.length,
      '| properties:', Object.keys(resolved.properties).length,
      '| elements:', Object.keys(resolved.elements).length,
      '| element keys:', Object.keys(resolved.elements));
    return resolved;
  });

  console.groupEnd();

  return {
    resolvedPages,
    pageOrder: pages.map((p) => p.id),
    nodeMap,
    errors: [],
  };
}

function resolvePage(pageNode, nodeMap, metadata) {
  const chain = [];
  let current = nodeMap[pageNode.parent];
  while (current) {
    chain.unshift({ id: current.id, type: current.type });
    current = current.parent ? nodeMap[current.parent] : null;
  }

  let properties = {};
  let elements = {};

  for (const entry of chain) {
    const tmpl = nodeMap[entry.id];
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

  return { pageId: pageNode.id, properties, elements, chain };
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
