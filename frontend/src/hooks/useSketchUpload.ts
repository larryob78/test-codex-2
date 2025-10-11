import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadSketch } from '../state/mockService';

const useSketchUpload = (projectId: string, frameId: string) => {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => uploadSketch(projectId, frameId, file),
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
