const state = {
  files: new Map(),
  parsed: new Map(),
};

export function addFile(path, content) {
  state.files.set(path, content);
  if (path.endsWith('.json')) {
    try {
      state.parsed.set(path, JSON.parse(content));
    } catch {
      state.parsed.delete(path);
    }
  }
}

export function updateFile(path, content) {
  state.files.set(path, content);
  if (path.endsWith('.json')) {
    try {
      state.parsed.set(path, JSON.parse(content));
    } catch {
      state.parsed.delete(path);
    }
  }
}

export function getRaw(path) {
  return state.files.get(path) ?? '';
}

export function getParsed(path) {
  return state.parsed.get(path);
}

export function getAllPaths() {
  return [...state.files.keys()];
}
