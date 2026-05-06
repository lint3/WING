const state = {
  files: new Map(),
  parsed: new Map(),
};

function addFile(path, content) {
  state.files.set(path, content);
  if (path.endsWith('.json')) {
    try {
      state.parsed.set(path, JSON.parse(content));
    } catch {
      state.parsed.delete(path);
    }
  }
}

function updateFile(path, content) {
  state.files.set(path, content);
  if (path.endsWith('.json')) {
    try {
      state.parsed.set(path, JSON.parse(content));
    } catch {
      state.parsed.delete(path);
    }
  }
}

function getRaw(path) {
  return state.files.get(path) ?? '';
}

function getParsed(path) {
  return state.parsed.get(path);
}

function getAllPaths() {
  return [...state.files.keys()];
}
