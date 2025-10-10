import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { VideoProvider } from '../state/types';

const fetchVideoProviders = async (): Promise<VideoProvider[]> => {
  const response = await axios.get<VideoProvider[]>('/api/ai/video/providers');
  return response.data;
};

const useVideoProviders = () => {
  return useQuery({
    queryKey: ['video-providers'],
    queryFn: fetchVideoProviders,
    initialData: [],
  });
};

export default useVideoProviders;
