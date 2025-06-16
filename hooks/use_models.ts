import { useConvex } from 'convex/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

export function useModels() : { 
  groupedModels: Record<string, Doc<"models">[]>;
  onGroupedModelsChange: (callback: (models: Record<string, Doc<"models">[]>) => void) => void;
} {
  const convex = useConvex();
  const [groupedModels, setGroupedModels] = useState<Record<string, Doc<"models">[]>>({});
  const callbacksRef = useRef<((models: Record<string, Doc<"models">[]>) => void)[]>([]);

  const onGroupedModelsChange = useCallback((callback: (models: Record<string, Doc<"models">[]>) => void) => {
    callbacksRef.current.push(callback);
  }, []);

  useEffect(() => {
    convex.query(api.models.get).then((fetchedModels) => {
      if (!fetchedModels || fetchedModels.length === 0) return;

      // Group models by category
      const grouped = fetchedModels.reduce((acc, model) => {
        const category = model.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(model);
        return acc;
      }, {} as Record<string, Doc<"models">[]>);

      // Sort models within each category alphabetically
      Object.keys(grouped).forEach(category => grouped[category].sort((a, b) => a.name.localeCompare(b.name)));
      
      setGroupedModels(grouped);
      
      // Call all registered callbacks
      callbacksRef.current.forEach(callback => callback(grouped));
    })
  }, [convex]);

  return { groupedModels, onGroupedModelsChange };
}