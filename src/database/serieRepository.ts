import { getDatabase } from './database';
import {
  Serie,
  SerieFilter,
  CreateSerieInput,
  UpdateSerieInput,
} from '../types/serie';

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = await getDatabase();

  if (filtro === 'assistindo') {
    return db.getAllAsync<Serie>(
      'SELECT * FROM series WHERE concluida = ? ORDER BY createdAt DESC, id DESC',
      [0]
    );
  }
  if (filtro === 'concluidas') {
    return db.getAllAsync<Serie>(
      'SELECT * FROM series WHERE concluida = ? ORDER BY createdAt DESC, id DESC',
      [1]
    );
  }
  return db.getAllAsync<Serie>(
    'SELECT * FROM series ORDER BY createdAt DESC, id DESC'
  );
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Serie>('SELECT * FROM series WHERE id = ?', [id]);
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO series (titulo, plataforma, temporadas, nota, concluida, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [input.titulo, input.plataforma, input.temporadas, input.nota, 0, createdAt]
  );
  return {
    id: result.lastInsertRowId,
    titulo: input.titulo,
    plataforma: input.plataforma,
    temporadas: input.temporadas,
    nota: input.nota,
    concluida: 0,
    createdAt,
  };
}

export async function updateSerie(
  id: number,
  input: UpdateSerieInput
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, nota = ? WHERE id = ?',
    [input.titulo, input.plataforma, input.temporadas, input.nota, id]
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET concluida = 1 - concluida WHERE id = ?',
    [id]
  );
}

export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM series WHERE id = ?', [id]);
}