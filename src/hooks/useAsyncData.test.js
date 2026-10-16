import { renderHook, act } from '@testing-library/react';
import { useAsyncData } from './useAsyncData';

describe('useAsyncData hook', () => {
  it('loads data successfully', async () => {
    const mockLoader = jest.fn().mockResolvedValue('test data');

    const { result } = renderHook(() => useAsyncData(mockLoader));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.hasError).toBe(false);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('test data');
    expect(result.current.hasError).toBe(false);
  });

  it('handles loader errors gracefully', async () => {
    const mockLoader = jest.fn().mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useAsyncData(mockLoader));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.hasError).toBe(true);
  });

  it('respects initial data provided', () => {
    const mockLoader = jest.fn().mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useAsyncData(mockLoader, 'initial-value'));

    expect(result.current.data).toBe('initial-value');
    expect(result.current.isLoading).toBe(true);
  });

  it('reloads data when reload is triggered', async () => {
    let callCount = 0;
    const mockLoader = jest.fn().mockImplementation(() => {
      callCount += 1;
      return Promise.resolve(`call-${callCount}`);
    });

    const { result } = renderHook(() => useAsyncData(mockLoader));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.data).toBe('call-1');

    await act(async () => {
      result.current.reload();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.data).toBe('call-2');
  });
});
