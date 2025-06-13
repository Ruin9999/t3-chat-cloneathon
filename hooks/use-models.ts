import { useConvex } from 'convex/react';
import { useState, useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

export function useModels() : Record<string, Doc<"models">[]> {
  const convex = useConvex();
  const [groupedModels, setGroupedModels] = useState<Record<string, Doc<"models">[]>>({});

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
    })
  }, [convex]);

  return groupedModels;
}