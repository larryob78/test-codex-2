import { blurNode, compositorNode, cropNode, resizeNode } from './builtins/image';
import {
  importNode,
  exportNode,
  previewNode,
  routerNode,
  outputNode,
  textIteratorNode
} from './builtins/helper';
import { promptNode, promptConcatNode, promptEnhancerNode, runAnyLlmNode } from './builtins/text';
import type { NodeManifest, NodeRegistry } from './types';

export * from './types';

export const builtInNodes: NodeManifest[] = [
  promptNode,
  promptConcatNode,
  promptEnhancerNode,
  runAnyLlmNode,
  importNode,
  exportNode,
  previewNode,
  routerNode,
  outputNode,
  textIteratorNode,
  compositorNode,
  cropNode,
  resizeNode,
  blurNode
];

export function createRegistry(additionalNodes: NodeManifest[] = []): NodeRegistry {
  return [...builtInNodes, ...additionalNodes].reduce<NodeRegistry>((registry, node) => {
    if (registry[node.id]) {
      throw new Error(`Duplicate node id detected: ${node.id}`);
    }
    registry[node.id] = node;
    return registry;
  }, {});
}
