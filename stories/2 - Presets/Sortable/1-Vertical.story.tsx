import React, { useState } from 'react';
import {
  DndContext,
  MeasuringStrategy,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  AnimateLayoutChanges,
  SortableContext,
  arrayMove,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';

import { createRange } from '../../utilities';
import { Sortable, Props as SortableProps } from './Sortable';
import { SortableItem as DemoItem } from '../../components/SortableItem';
import { PointerSensor } from '@dnd-kit/core';

export default {
  title: 'Presets/Sortable/Vertical',
};

const props: Partial<SortableProps> = {
  strategy: verticalListSortingStrategy,
  itemCount: 50,
};

export const BasicDemo = () => {
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <DemoItem key={id} id={id}>
            {id}
          </DemoItem>
        ))}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
};

export const BasicSetup = () => <Sortable {...props} />;

export const WithoutDragOverlay = () => (
  <Sortable {...props} useDragOverlay={false} />
);

export const DragHandle = () => <Sortable {...props} handle />;

export const LockedAxis = () => (
  <Sortable
    {...props}
    modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
  />
);

export const RestrictToScrollContainer = () => (
  <div
    style={{
      height: '50vh',
      width: 350,
      margin: '200px auto 0',
      overflow: 'auto',
    }}
  >
    <Sortable {...props} modifiers={[restrictToFirstScrollableAncestor]} />
  </div>
);

export const ScrollContainer = () => (
  <div
    style={{
      height: '50vh',
      margin: '200px auto 0',
      overflow: 'auto',
    }}
  >
    <Sortable {...props} />
  </div>
);

export const PressDelay = () => (
  <Sortable
    {...props}
    activationConstraint={{
      delay: 250,
      tolerance: 5,
    }}
  />
);

export const MinimumDistance = () => (
  <Sortable
    {...props}
    activationConstraint={{
      distance: 15,
    }}
  />
);

export const VariableHeights = () => {
  const randomHeights = createRange(props.itemCount as number).map(() => {
    const heights = [110, undefined, 140, undefined, 90, undefined];
    const randomHeight = heights[Math.floor(Math.random() * heights.length)];

    return randomHeight;
  });

  return (
    <Sortable
      {...props}
      wrapperStyle={({ id }) => {
        return {
          height: randomHeights[Number(id)],
        };
      }}
    />
  );
};

export const DisabledItems = () => {
  const disabledItems: UniqueIdentifier[] = [1, 5, 8, 13, 20];
  return (
    <Sortable
      {...props}
      isDisabled={(value) => disabledItems.includes(value)}
    />
  );
};

export const MarginBetweenItems = () => {
  const getMargin = (index: number) => {
    if ([0, 6, 25, 45].includes(index)) {
      return 25;
    }

    if ([10, 15, 35].includes(index)) {
      return 80;
    }

    return 0;
  };

  return (
    <Sortable
      {...props}
      wrapperStyle={({ index }) => {
        return {
          marginBottom: getMargin(index),
        };
      }}
    />
  );
};

export const RerenderBeforeSorting = () => {
  return (
    <Sortable
      {...props}
      wrapperStyle={({ active }) => {
        return {
          height: active ? 100 : 80,
        };
      }}
    />
  );
};

export const RemovableItems = () => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  return (
    <Sortable
      {...props}
      animateLayoutChanges={animateLayoutChanges}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      removable
      handle
    />
  );
};

export const TransformedContainer = () => {
  return (
    <Sortable {...props} style={{ transform: 'translate3d(100px, 100px, 0)' }} />
  );
};
