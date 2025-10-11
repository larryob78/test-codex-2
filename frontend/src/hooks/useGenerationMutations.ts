import { useMutation, useQueryClient } from '@tanstack/react-query';

import { confirmGeneration, generateForFrame } from '../state/mockService';
import { GenerationSettingsInput } from '../state/types';

const useGenerationMutations = (frameId?: string, projectId?: string) => {
  const client = useQueryClient();

  const invalidateRelatedQueries = () => {
    if (frameId) {
      client.invalidateQueries({ queryKey: ['generations', frameId] });
    }
    if (projectId) {
      client.invalidateQueries({ queryKey: ['project', projectId] });
    }
  };

  const generate = useMutation({
    mutationFn: async (settings: GenerationSettingsInput) => {
      if (!frameId) {
        throw new Error('Frame not selected');
      }
      return generateForFrame(frameId, settings);
    },
    onSuccess: () => {
      invalidateRelatedQueries();
    },
  });

  const confirm = useMutation({
    mutationFn: (generationId: string) => confirmGeneration(generationId),
    onSuccess: () => {
      invalidateRelatedQueries();
    },
  });

  return {
    generate: (settings: GenerationSettingsInput) => generate.mutateAsync(settings),
    confirm: (generationId: string) => confirm.mutateAsync(generationId),
    isGenerating: generate.isPending,
    isConfirming: confirm.isPending,
  };
};

export default useGenerationMutations;
