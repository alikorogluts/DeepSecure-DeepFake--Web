import { useCallback, useEffect, useRef, useState } from 'react';
import { AnalysisService } from '@/services/analysis.service';
import { HistoryItemDto, PaginatedHistoryResponseDto } from '@/types/analysis.types';
import { useApiRetry } from '@/hooks/useApiRetry';
import { logDevError } from '@/lib/error-message';
import { getRetryDelay, isRetryableApiError } from '@/lib/api-retry';

const HISTORY_PAGE_SIZE = 12;

function appendUniqueItems(currentItems: HistoryItemDto[], nextItems: HistoryItemDto[]) {
  const seenIds = new Set(currentItems.map(item => item.analysisId));
  const uniqueNextItems = nextItems.filter(item => {
    if (seenIds.has(item.analysisId)) return false;
    seenIds.add(item.analysisId);
    return true;
  });

  return [...currentItems, ...uniqueNextItems];
}

function getHasMore(response: PaginatedHistoryResponseDto, loadedCount: number) {
  if (response.data.length === 0) return false;
  if (typeof response.hasNextPage === 'boolean') return response.hasNextPage;
  if (typeof response.totalPages === 'number') return response.page < response.totalPages;
  if (typeof response.totalCount === 'number') return loadedCount < response.totalCount;

  return response.data.length === response.pageSize;
}

export function useAnalysisHistory() {
  const request = useCallback(async () => {
    const response = await AnalysisService.getHistoryPage(1, HISTORY_PAGE_SIZE);
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data : [],
    };
  }, []);

  const retryState = useApiRetry<PaginatedHistoryResponseDto>({
    request,
    fallbackErrorMessage: 'Geçmiş analizler şu anda yüklenemedi. Lütfen daha sonra tekrar deneyin.',
    logMessage: 'Geçmiş yüklenemedi:',
  });
  const [items, setItems] = useState<HistoryItemDto[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    if (!retryState.data) return;

    const firstPageItems = retryState.data.data.slice(0, HISTORY_PAGE_SIZE);
    setItems(firstPageItems);
    setPage(retryState.data.page);
    setHasMore(getHasMore(retryState.data, firstPageItems.length));
    setLoadMoreError(null);
  }, [retryState.data]);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMore) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    const nextPage = page + 1;
    let attempt = 0;

    const fetchPage = async (): Promise<void> => {
      try {
        const response = await AnalysisService.getHistoryPage(nextPage, HISTORY_PAGE_SIZE);
        const pageItems = (Array.isArray(response.data) ? response.data : []).slice(0, HISTORY_PAGE_SIZE);

        setItems(currentItems => {
          const mergedItems = appendUniqueItems(currentItems, pageItems);
          setHasMore(getHasMore({ ...response, data: pageItems }, mergedItems.length));
          return mergedItems;
        });
        setPage(response.page);
        setLoadMoreError(null);
      } catch (err) {
        logDevError('Ek analizler yüklenemedi:', err);

        if (isRetryableApiError(err) && attempt < 5) {
          attempt += 1;
          await new Promise(resolve => setTimeout(resolve, getRetryDelay(attempt)));
          return fetchPage();
        }

        setLoadMoreError('Ek analizler yüklenemedi. Tekrar deneyin.');
      }
    };

    try {
      await fetchPage();
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMore, page]);

  return {
    history: items,
    loading: retryState.loading,
    error: retryState.error,
    retrying: retryState.retrying,
    retryAttempt: retryState.retryAttempt,
    retryMessage: retryState.retryMessage,
    refetch: retryState.retryNow,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
  }; 
}
