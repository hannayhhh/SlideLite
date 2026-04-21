const normalizePresentation = (id, legacyKey, presentation = {}) => ({
  id: Number(id),
  name: presentation.name || legacyKey || `Presentation ${id}`,
  description: presentation.description || '',
  slides: presentation.slides || { slide1: { id: 1, background: '#fff', backgroundStyle: '', content1: { type: '', data: '' } } }
});

export const normalizeStoreShape = (store = {}) => {
  const rawPresentations = store.presentations || {};
  const normalizedPresentations = {};
  let changed = false;
  let maxId = 0;

  Object.entries(rawPresentations).forEach(([key, presentation]) => {
    const parsedId = Number(key);
    const hasNumericKey = Number.isInteger(parsedId) && String(parsedId) === String(key);
    const nextId = hasNumericKey ? parsedId : maxId + 1;

    if (!hasNumericKey) {
      changed = true;
    }

    maxId = Math.max(maxId, nextId);
    const normalizedPresentation = normalizePresentation(nextId, hasNumericKey ? presentation?.name : key, presentation);

    if (
      !presentation?.id ||
      presentation.id !== nextId ||
      !presentation?.name ||
      !presentation?.slides
    ) {
      changed = true;
    }

    normalizedPresentations[String(nextId)] = normalizedPresentation;
  });

  if ((store.presentations || {}) !== normalizedPresentations) {
    const oldKeys = Object.keys(rawPresentations);
    const newKeys = Object.keys(normalizedPresentations);
    if (oldKeys.length !== newKeys.length || oldKeys.some((key, index) => key !== newKeys[index])) {
      changed = true;
    }
  }

  return {
    store: {
      ...store,
      presentations: normalizedPresentations,
    },
    changed,
  };
};

export const getNextPresentationId = (presentations = {}) => {
  const ids = Object.keys(presentations).map((key) => Number(key)).filter((id) => Number.isInteger(id));
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};
