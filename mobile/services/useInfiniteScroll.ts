import { useCallback, useEffect, useState } from "react";

interface UseInfiniteScrollProps<T> {
    fetchFunction: (page: number) => Promise<T[]>;
    initialPage?: number;
    pageSize?: number;
}

const useInfiniteScroll = <T>({
    fetchFunction,
    initialPage = 1,
    pageSize = 20
}: UseInfiniteScrollProps<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);

    // Initial fetch
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchFunction(initialPage);
            setData(result);
            setPage(initialPage + 1);

            // If we got less than pageSize, there's no more data
            if (result.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Load more data
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            setError(null);

            const result = await fetchFunction(page);

            if (result.length === 0) {
                setHasMore(false);
            } else {
                setData(prevData => [...prevData, ...result]);
                setPage(prevPage => prevPage + 1);

                // If we got less than pageSize, there's no more data
                if (result.length < pageSize) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more data");
        } finally {
            setLoadingMore(false);
        }
    }, [fetchFunction, page, loadingMore, hasMore, pageSize]);

    // Reset function
    const reset = () => {
        setData([]);
        setError(null);
        setLoading(false);
        setLoadingMore(false);
        setPage(initialPage);
        setHasMore(true);
    };

    // Refresh function
    const refresh = async () => {
        reset();
        await fetchInitialData();
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    return {
        data,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refresh,
        reset
    };
};

export default useInfiniteScroll;
