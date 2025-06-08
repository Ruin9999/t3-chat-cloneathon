import { trim } from '@/lib/utils';
import { useDraggable, useSensor, PointerSensor } from '@dnd-kit/core';

import { Pin, Trash2 } from 'lucide-react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuShortcut } from '@/components/ui/context-menu';

interface ChatButtonProps {
  id: string;
  title : string;
  href : string;
  className ?: string;
}

export default function ChatButton(props: ChatButtonProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: props.id });

  const style = transform ? {
    display: 'flex',
    
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return <ContextMenu>
    <ContextMenuTrigger className="hover:cursor-pointer">
      <div ref={setNodeRef} style={style} className={`flex py-2 px-3 rounded-md hover:bg-slate-300 ${props.className}`} {...attributes} {...listeners}>
        <div className="flex-1 flex items-center justify-left text-sm">
          { trim(props.title, 30) }
        </div>
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem className="flex items-center">
        <Pin size={24} />
        <span>Pin</span>
      </ContextMenuItem>
      <ContextMenuItem>
        <Trash2 size={24} />
        <span>Delete</span>
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
  
}