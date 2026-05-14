Each node in the resulting forest contains:

- `type`: "template" | "page" | "modifier"
- `id`: unique string key (template name, page id, modifier id)
- `parent`: string ref to parent id, or null
- `own_data`: the raw JSON object this node was materialized from
- `children`: array of direct child nodes

Data inheritance (properties, elements, slots, extra_vars) is resolved at render time
by walking the parent chain top-down; deeper nodes override ancestors.
The forest builder only constructs the structural hierarchy.

## Pseudocode

```
// ---------------------------------------------------------------------------
// Phase 1 — Materialize every node from the source package
// ---------------------------------------------------------------------------

define nodeMap = {}   // id → node, for O(1) lookup during Phase 2

function materialize(type, id, parent, raw_data):
    if id not in nodeMap:
        nodeMap[id] = { type, id, parent, own_data: raw_data, children: [] }

for each [key, template] in document_template.page_templates:
    materialize("template", key, template.parent, template)

for each page in document_data.pages:
    materialize("page", page.id, page.parent, page)

for each modifier in document/ JSON fragments:
    materialize("modifier", modifier.id, null, modifier)


// ---------------------------------------------------------------------------
// Phase 2 — Build the forest by traversing upward from each node
// ---------------------------------------------------------------------------

define forest = { trees: [], nodeIndex: {} }   // nodeIndex: id → node within forest

function join_node_to_forest(node_id, nodeMap, forest):
    // If this node was already placed in the forest, return it (shared ancestor hit).
    if node_id in forest.nodeIndex:
        return forest.nodeIndex[node_id]

    n = nodeMap[node_id]
    if n is null:
        return null   // dangling parent reference — skip

    // Recursively place the parent first so the ancestor chain is in the forest.
    if n.parent is not null:
        parentNode = join_node_to_forest(n.parent, nodeMap, forest)
        if parentNode is not null:
            parentNode.children.append(n)

    // If no parent (or parent was unresolvable), this node starts a new tree.
    else:
        forest.trees.append(n)

    forest.nodeIndex[n.id] = n
    return n


// Join every node. Order does not matter — nodeIndex prevents duplication
// and the recursion handles arbitrary parent chains.
// Pages and modifiers are joined before templates so that templates only
// enter the forest when they are actually referenced.

for each modifier in nodeMap (where type is "modifier"):
    join_node_to_forest(modifier.id, nodeMap, forest)

for each page in nodeMap (where type is "page"):
    join_node_to_forest(page.id, nodeMap, forest)

for each template in nodeMap (where type is "template"):
    join_node_to_forest(template.id, nodeMap, forest)
```

## What was fixed

| Bug | Fix |
|-----|-----|
| Subtrees created during upward traversal were discarded | Recursion returns the placed node; the caller attaches `n` as a child of the returned parent. No temporary trees are created. |
| `"n in f"` had no defined lookup semantics | `forest.nodeIndex` provides O(1) ID-based lookup. `nodeMap` stores all nodes by ID before forest construction begins. |
| `nodeMap` was defined but never used | It is now populated during Phase 1 and drives all lookups during Phase 2. |
| Recursive call was missing the forest parameter | `join_node_to_forest` now takes `(node_id, nodeMap, forest)` consistently. |
| Modifiers were never iterated over | Modifier JSONs from `document/` are materialized in Phase 1 and joined in Phase 2. Modifiers have no parent (they are roots in the forest). |
| No data inheritance mechanism described | The node shape now carries `own_data`. Inheritance is deferred to render time; this doc only describes tree construction. |

## Open questions

- Modifiers have `conditions` and `targets` referencing specific elements. Should modifiers be attached somewhere in the tree (e.g., to the page or template they modify), or remain as standalone roots to be evaluated by the renderer?
- If a page references a template that does not exist in `document_template.json`, what should happen? Currently the dangling reference is silently skipped.
