import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import * as SerieRepository from '../database/serieRepository';
import { Serie, SerieFilter } from '../types/serie';

export function useSeries() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SerieFilter>('todas');

  const loadSeries = useCallback(async () => {
    try {
      setLoading(true);
      setSeries(await SerieRepository.getSeries('todas'));
    } catch (error) {
      console.error('Erro ao carregar séries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Wrapper síncrono: useFocusEffect não deve receber função async direto
  useFocusEffect(
    useCallback(() => {
      loadSeries();
    }, [loadSeries]),
  );

  const toggleSerie = useCallback(
    async (id: number) => {
      await SerieRepository.toggleSerieConcluida(id);
      await loadSeries();
    },
    [loadSeries],
  );

  const removeSerie = useCallback(
    async (id: number) => {
      await SerieRepository.deleteSerie(id);
      await loadSeries();
    },
    [loadSeries],
  );

  const filteredSeries = useMemo(() => {
    if (filter === 'assistindo') return series.filter((s) => s.concluida === 0);
    if (filter === 'concluidas') return series.filter((s) => s.concluida === 1);
    return series;
  }, [series, filter]);

  const counts = useMemo(
    () => ({
      todas: series.length,
      assistindo: series.filter((s) => s.concluida === 0).length,
      concluidas: series.filter((s) => s.concluida === 1).length,
    }),
    [series],
  );

  return {
    series: filteredSeries,
    counts,
    filter,
    setFilter,
    loading,
    toggleSerie,
    removeSerie,
  };
}