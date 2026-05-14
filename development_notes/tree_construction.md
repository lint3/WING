Each node in the resulting tree should contain type (page, template, or modifier) as well as all the data defined in the imported jsons.

## Pseudocode

```
function join_node_to_forest(n, f):
  // Note: Node may have children already.
  // This algorithm only traverses upward from n.
  
  if n in f:
    return
    
  if n has parent:
    // Traverse upward

    if n.parent in f:
      // This node can be merged into the tree directly
      append n as child of f[n.parent]
      return true
    else:
      // Traverse upward to see if a parent of this node can be merged
      define newTree = [Create a new tree with n.parent as root, n as child, and retain all of n's children]
      
      return join_node_to_forest(n.parent)
  else:
    // The currently traversed graph cannot be merged to any of this forest's trees
    append n as tree in f
    

define resultForest = new empty list
define nodeMap = empty object

for every page in document_data.pages:
  join_node_to_forest(page, resultForest)

for every template in document_template.templates:
  join_node_to_forest(template, resultForest)
```
