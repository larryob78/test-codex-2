import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { Frame } from '../state/types';


const useSketchUpload = (projectId: string, frameId: string) => {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post<Frame>(`/api/frames/${frameId}/sketch`, formData);
      return response.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  return {
    upload: (file: File) => mutation.mutateAsync(file),
    isUploading: mutation.isPending,
  };
};

export default useSketchUpload;
