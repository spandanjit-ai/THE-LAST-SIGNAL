export const CONTAINMENT_ELEMENT_ID = 'containment-anomaly-node';
export const CONTAINMENT_ATTRIBUTE = 'data-containment-protocol';
export const CONTAINMENT_INITIAL_VALUE = 'RESTRICTED';
export const CONTAINMENT_TARGET_VALUE = 'OVERRIDE';

export interface ContainmentObserverOptions {
  targetElement: HTMLElement | null;
  onValidMutation: (attribute: string, value: string) => void;
  onInvalidMutation?: (attribute: string, value: string) => void;
}

/**
 * Attaches a scoped, high-performance MutationObserver strictly to the designated
 * containment DOM element, listening only for changes to `data-containment-protocol`.
 *
 * Disconnects cleanly upon cleanup or successful mutation to avoid duplicate events.
 */
export function attachContainmentObserver(options: ContainmentObserverOptions): () => void {
  const { targetElement, onValidMutation, onInvalidMutation } = options;

  if (!targetElement || typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }

  // Ensure element has the initial restricted protocol attribute set
  if (!targetElement.hasAttribute(CONTAINMENT_ATTRIBUTE)) {
    targetElement.setAttribute(CONTAINMENT_ATTRIBUTE, CONTAINMENT_INITIAL_VALUE);
  }

  // Fast-path: if attribute is already overridden (e.g. from state restore), check it
  const currentValue = (targetElement.getAttribute(CONTAINMENT_ATTRIBUTE) || '').trim().toUpperCase();
  if (currentValue === CONTAINMENT_TARGET_VALUE) {
    onValidMutation(CONTAINMENT_ATTRIBUTE, currentValue);
    return () => {};
  }

  let hasTriggered = false;

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    if (hasTriggered) return;

    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === CONTAINMENT_ATTRIBUTE) {
        const target = mutation.target as HTMLElement;
        const rawValue = target.getAttribute(CONTAINMENT_ATTRIBUTE);
        const value = (rawValue || '').trim().toUpperCase();

        if (value === CONTAINMENT_TARGET_VALUE) {
          hasTriggered = true;
          onValidMutation(CONTAINMENT_ATTRIBUTE, value);
          observer.disconnect();
          break;
        } else if (value && value !== CONTAINMENT_INITIAL_VALUE) {
          if (onInvalidMutation) {
            onInvalidMutation(CONTAINMENT_ATTRIBUTE, rawValue || '');
          }
        }
      }
    }
  });

  observer.observe(targetElement, {
    attributes: true,
    attributeFilter: [CONTAINMENT_ATTRIBUTE],
    attributeOldValue: true,
  });

  return () => {
    observer.disconnect();
  };
}
