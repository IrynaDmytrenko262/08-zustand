import axios from 'axios';
import type { Note } from '../types/note';

interface ApiResponse {
  notes: Note[];
  totalPages: number;
}

export interface NewNote {
  title: string;
  content: string;
  tag: string;
}

const noteApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  searchText: string,
  page: number = 1,
  perPage: number = 12,
  tag: string,
): Promise<ApiResponse> => {
  const response = await noteApi.get<ApiResponse>('/notes', {
    params: {
      search: searchText || undefined,
      page: page,
      perPage: perPage,
      tag: tag || undefined,
    },
  });
  return response.data;
};

export const createNote = async (newNote: NewNote) => {
  const response = await noteApi.post<Note>('/notes', newNote);
  return response.data;
};

export const deleteNote = async (noteId: string) => {
  const response = await noteApi.delete<Note>(`/notes/${noteId}`);
  return response.data;
};

export const fetchNoteById = async (noteId: string) => {
  const response = await noteApi.get<Note>(`/notes/${noteId}`);
  return response.data;
};