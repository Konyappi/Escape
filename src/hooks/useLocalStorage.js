import { useCallback, useState } from 'react';
import { safeRead, safeWrite } from '../utils/storage.js';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => safeRead(key, initialValue));

  const updateValue = useCallback(
    (nextValue) => {
      setValue((current) => {
        const resolved = typeof nextValue === 'function' ? nextValue(current) : nextValue;
        safeWrite(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, updateValue];
}
