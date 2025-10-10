import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Generation } from '../state/types';

const fetchGenerations = async (frameId: string): Promise<Generation[]> => {
  const response = await axios.get<Generation[]>(`/api/frames/${frameId}/generations`);
  return response.data;
};

const useGenerations = (frameId: string | null) => {
  return useQuery({
    queryKey: ['generations', frameId],
    queryFn: () => fetchGenerations(frameId ?? ''),
    enabled: Boolean(frameId),
    initialData: [],
  });
};

export default useGenerations;
