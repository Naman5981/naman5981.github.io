import { useEffect, useState } from 'react';

/**
 * Custom hook to execute an asynchronous loader function with consistent
 * data, loading, and error states.
 *
 * @param {() => Promise<T>} asyncLoader - The asynchronous data loading function
 * @param {T|null} initialData - Optional initial data state
 * @returns {{ data: T|null, hasError: boolean, isLoading: boolean, reload: () => void }}
 */
export const useAsyncData = (asyncLoader, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const executeLoad = async () => {
      setIsLoading(true);
      try {
        const result = await asyncLoader();
        if (isMounted) {
          setData(result);
          setHasError(false);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    executeLoad();

    return () => {
      isMounted = false;
    };
  }, [asyncLoader, reloadIndex]);

  const reload = () => setReloadIndex((prev) => prev + 1);

  return { data, hasError, isLoading, reload };
};
