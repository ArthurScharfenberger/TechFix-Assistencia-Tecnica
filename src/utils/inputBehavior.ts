export function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    };
    return entities[character];
  });
}

interface DebouncedSearchOptions {
  input: HTMLInputElement;
  root: HTMLElement;
  selector: string;
  onValue: (value: string) => void;
  render: () => void;
  delay?: number;
}

/**
 * Atualiza o estado durante a digitação e só recria a listagem após uma pausa.
 * Depois do render, devolve o foco e a posição do cursor ao novo input.
 */
export function bindDebouncedSearch(options: DebouncedSearchOptions): void {
  const { input, root, selector, onValue, render, delay = 250 } = options;
  let timer: number | undefined;

  const schedule = (): void => {
    onValue(input.value);
    window.clearTimeout(timer);
    const cursor = input.selectionStart ?? input.value.length;
    timer = window.setTimeout(() => {
      if (!root.isConnected) return;
      render();
      const replacement = root.querySelector<HTMLInputElement>(selector);
      if (!replacement) return;
      replacement.focus({ preventScroll: true });
      const position = Math.min(cursor, replacement.value.length);
      replacement.setSelectionRange(position, position);
    }, delay);
  };

  input.addEventListener('input', (event) => {
    if ((event as InputEvent).isComposing) {
      onValue(input.value);
      return;
    }
    schedule();
  });
  input.addEventListener('compositionend', schedule);
}
