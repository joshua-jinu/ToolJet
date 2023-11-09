import React, { useEffect, useState, useRef } from 'react';
import Moveable from 'react-moveable';
import { useEditorStore } from '@/_stores/editorStore';
import { shallow } from 'zustand/shallow';
import './DragContainer.css';
import DragContainerNested from './DragContainerNested';
import { isEmpty } from 'lodash';
import { flushSync } from 'react-dom';
const NO_OF_GRIDS = 24;

const MouseCustomAble = {
  name: 'mouseTest',
  props: {},
  events: {},
  mouseEnter(e) {
    console.log('MouseCustomAble ENTER', e, e?.controlBox);
    e.controlBox.classList.add('moveable-control-box-d-block');
  },
  mouseLeave(e) {
    console.log('MouseCustomAble LEAVE', e);
    e.controlBox.classList.remove('moveable-control-box-d-block');
  },
};

export default function DragContainer({
  boxes,
  renderWidget,
  canvasWidth,
  onResizeStop,
  onDrag,
  gridWidth,
  selectedComponents = [],
  setIsDragging,
  currentLayout,
}) {
  const [dragTarget, setDragTarget] = useState();
  const [draggedTarget, setDraggedTarget] = useState();
  const moveableRef = useRef();
  const [movableTargets, setMovableTargets] = useState([]);
  const [isChildDragged, setIsChildDragged] = useState(false);
  const boxList = boxes.map((box) => ({
    id: box.id,
    height: box?.layouts?.[currentLayout]?.height,
    left: box?.layouts?.[currentLayout]?.left,
    top: box?.layouts?.[currentLayout]?.top,
    width: box?.layouts?.[currentLayout]?.width,
    parent: box?.component?.parent,
  }));
  const [list, setList] = useState(boxList);

  console.log('isChildDragged => ', isChildDragged);

  const hoveredComponent = useEditorStore((state) => state?.hoveredComponent, shallow);
  const [count, setCount] = useState(0);

  useEffect(() => {
    moveableRef.current.updateRect();
    moveableRef.current.updateTarget();
    moveableRef.current.updateSelectors();
    setTimeout(reloadGrid, 100);
  }, [JSON.stringify(selectedComponents), JSON.stringify(boxes)]);

  useEffect(() => {
    setList(boxList);
    setTimeout(reloadGrid, 100);
  }, [currentLayout]);

  const reloadGrid = async () => {
    setCount((c) => c + 1);
    if (moveableRef.current) {
      moveableRef.current.updateRect();
      moveableRef.current.updateTarget();
      moveableRef.current.updateSelectors();
    }
  };

  window.reloadGrid = reloadGrid;

  useEffect(() => {
    setList(boxList);
  }, [JSON.stringify(boxes)]);

  useEffect(() => {
    const groupedTargets = [...selectedComponents.map((component) => '.ele-' + component.id)];
    // const newMovableTargets = groupedTargets.length
    //   ? [groupedTargets.length == 1 ? groupedTargets[0] : groupedTargets]
    //   : [];
    const newMovableTargets = groupedTargets.length ? [...groupedTargets] : [];
    if (hoveredComponent && groupedTargets?.length <= 1 && !groupedTargets.includes('.ele-' + hoveredComponent)) {
      newMovableTargets.push('.ele-' + hoveredComponent);
    }

    if (draggedTarget && !newMovableTargets.includes(`.ele-${draggedTarget}`)) {
      newMovableTargets.push('.ele-' + draggedTarget);
    }

    setMovableTargets(isChildDragged ? [] : draggedTarget ? ['.ele-' + draggedTarget] : newMovableTargets);
  }, [selectedComponents, hoveredComponent, draggedTarget, isChildDragged]);

  useEffect(() => {
    reloadGrid();
  }, [movableTargets]);

  const getDimensions = (id) => {
    const box = boxes.find((b) => b.id === id);
    const layoutData = box?.layouts?.[currentLayout];
    if (isEmpty(layoutData)) {
      return {};
    }
    // const width = (canvasWidth * layoutData.width) / NO_OF_GRIDS;
    const width = gridWidth * layoutData.width;

    return {
      width: width + 'px',
      height: layoutData.height + 'px',
      transform: `translate(${layoutData.left * gridWidth}px, ${layoutData.top}px)`,
    };
  };

  const groupedTargets = [...selectedComponents.map((component) => '.ele-' + component.id)];

  return (
    <div className="root">
      <div className="container p-0">
        {/* <div className={movableTargets.length == 0 ? `move-target` : ''} style={{ width: '1px' }}></div> */}
        {list
          .filter((i) => isEmpty(i.parent))
          .map((i) => (
            <div
              className={`target widget-target target1 ele-${i.id}`}
              data-id={`${i.parent}`}
              key={i.id}
              id={i.id}
              widgetid={i.id}
              style={{ transform: `translate(332px, -134px)`, ...getDimensions(i.id) }}
            >
              {/* Target {i.id} */}
              {renderWidget(i.id, undefined, (dragged) => {
                console.log('====> dragged <=====', dragged);
                setIsChildDragged(dragged);
              })}
            </div>
          ))}

        <Moveable
          ref={moveableRef}
          ables={[MouseCustomAble]}
          props={{
            mouseTest: true,
          }}
          flushSync={flushSync}
          // target={movableTargets}
          // target={'.move-target'}
          target={groupedTargets.length ? [groupedTargets] : ['.widget-target']}
          // hideDefaultLines
          origin={false}
          // hideChildMoveableDefaultLines={false}
          // individualGroupable={true}
          individualGroupable={selectedComponents.length <= 1}
          draggable={true}
          resizable={true}
          keepRatio={false}
          //   rotatable={true}
          key={list.length}
          individualGroupableProps={(element) => {
            if (element?.classList.contains('target2')) {
              return {
                resizable: false,
              };
            }
          }}
          onResize={(e) => {
            console.log('onResize', e);
            const width = Math.round(e.width / gridWidth) * gridWidth;

            const currentLayout = list.find(({ id }) => id === e.target.id);
            const currentWidth = currentLayout.width * gridWidth;
            const diffWidth = e.width - currentWidth;
            const diffHeight = e.height - currentLayout.height;
            console.log('currentLayout width', currentWidth, e.width, diffWidth, e.direction);
            const isLeftChanged = e.direction[0] === -1;
            const isTopChanged = e.direction[1] === -1;

            console.log(
              'currentLayout transform',
              `translate(${currentLayout.left * gridWidth}px, ${currentLayout.top}px)`,
              `translate(${currentLayout.left * gridWidth - diffWidth}px, ${currentLayout.top}px)`
            );

            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            let transformX = currentLayout.left * gridWidth;
            let transformY = currentLayout.top;
            if (isLeftChanged) {
              transformX = currentLayout.left * gridWidth - diffWidth;
            }
            if (isTopChanged) {
              transformY = currentLayout.top - diffHeight;
            }
            e.target.style.transform = `translate(${transformX}px, ${transformY}px)`;

            // e.target.style.transform = e.drag.transform;
            // onResizeStop([
            //   {
            //     id: e.target.id,
            //     height: e.height,
            //     width: width,
            //     x: e.drag.translate[0],
            //     y: e.drag.translate[1],
            //   },
            // ]);
          }}
          onResizeEnd={(e) => {
            try {
              console.log('onResizeEnd>>>>>>>>>>>>>>', e);
              // const width = Math.round(e.lastEvent.width / gridWidth) * gridWidth;
              // e.target.style.width = `${width}px`;
              // e.target.style.height = `${e.lastEvent.height}px`;
              // e.target.style.transform = e.lastEvent.drag.transform;
              // onResizeStop([
              //   {
              //     id: e.target.id,
              //     height: e.lastEvent.height,
              //     width: width,
              //     x: e.lastEvent.drag.translate[0],
              //     y: e.lastEvent.drag.translate[1],
              //   },
              // ]);

              const width = Math.round(e.lastEvent.width / gridWidth) * gridWidth;
              const height = Math.round(e.lastEvent.height / 10) * 10;

              const currentLayout = list.find(({ id }) => id === e.target.id);
              const currentWidth = currentLayout.width * gridWidth;
              const diffWidth = e.lastEvent.width - currentWidth;
              const diffHeight = e.lastEvent.height - currentLayout.height;
              console.log('onResizeEnd data', currentWidth, e.width, diffWidth, e.direction, diffHeight);
              const isLeftChanged = e.lastEvent.direction[0] === -1;
              const isTopChanged = e.lastEvent.direction[1] === -1;

              console.log(
                'onResizeEnd => currentLayout transform',
                `translate(${currentLayout.left * gridWidth}px, ${currentLayout.top}px)`,
                `translate(${currentLayout.left * gridWidth - diffWidth}px, ${currentLayout.top}px)`
              );

              let transformX = currentLayout.left * gridWidth;
              let transformY = currentLayout.top;
              if (isLeftChanged) {
                transformX = currentLayout.left * gridWidth - diffWidth;
              }
              if (isTopChanged) {
                transformY = currentLayout.top - diffHeight;
              }

              // e.target.style.transform = e.drag.transform;
              onResizeStop([
                {
                  id: e.target.id,
                  height: height,
                  width: width,
                  x: transformX,
                  y: transformY,
                },
              ]);
            } catch (error) {
              console.error('ResizeEnd error ->', error);
            }
          }}
          onResizeStart={(e) => {
            console.log('onResizeStart =>', e);
          }}
          onResizeGroup={({ events }) => {
            const newBoxs = [];
            events.forEach((ev) => {
              ev.target.style.width = `${ev.width}px`;
              ev.target.style.height = `${ev.height}px`;
              ev.target.style.transform = ev.drag.transform;
              newBoxs.push({
                id: ev.target.id,
                height: ev.height,
                width: ev.width,
                x: ev.drag.translate[0],
                y: ev.drag.translate[1],
              });
            });
            onResizeStop(newBoxs);
          }}
          checkInput
          onDragStart={(e) => {
            console.log('On-drag start => ', e?.moveable?.getControlBoxElement());
            setDraggedTarget(e.target.id);
            setIsDragging(true);
          }}
          onDragEnd={(e) => {
            try {
              console.log('On-drag end => ');
              setIsDragging(false);
              console.log('onDragEnd', e);
              setDraggedTarget();
              if (isChildDragged) {
                return;
              }

              let draggedOverElemId;
              if (document.elementFromPoint(e.clientX, e.clientY)) {
                const targetElems = document.elementsFromPoint(e.clientX, e.clientY);
                console.log(
                  'draggedOverElem - list',
                  targetElems.find(
                    (ele) =>
                      ele.id !== e.target.id &&
                      (ele.classList.contains('target') || ele.classList.contains('nested-target'))
                  )
                );
                const draggedOverElem = targetElems.find(
                  (ele) =>
                    ele.id !== e.target.id &&
                    (ele.classList.contains('target') || ele.classList.contains('nested-target'))
                );
                setDragTarget(draggedOverElem?.id);
                draggedOverElemId = draggedOverElem?.id;
              }
              // console.log("draggedOverElemId", draggedOverElemId);
              const parentElem = list.find(({ id }) => id === draggedOverElemId);
              let left = e.lastEvent.translate[0];
              let top = e.lastEvent.translate[1];
              if (parentElem) {
                left = left - parentElem.left * gridWidth;
                top = top - parentElem.top;
              } else {
                e.target.style.transform = `translate(${Math.round(left / gridWidth) * gridWidth}px, ${
                  Math.round(top / 10) * 10
                }px)`;
              }
              onDrag([
                {
                  id: e.target.id,
                  x: left,
                  y: Math.round(top / 10) * 10,
                  parent: draggedOverElemId,
                },
              ]);
            } catch (error) {
              console.log('error', error);
            }
          }}
          onDrag={(e) => {
            console.log('On-drag ... => ');
            if (isChildDragged) {
              return;
            }
            setDraggedTarget(e.target.id);
            // onDrag(e.target.id, e.translate[0], e.translate[1]);
            // console.log(e.target.style);
            if (!isChildDragged) {
              // e.target.style.transform = `translate(${Math.round(e.translate[0] / gridWidth) * gridWidth}px, ${
              //   Math.round(e.translate[1] / 10) * 10
              // }px)`;
              e.target.style.transform = `translate(${e.translate[0]}px, ${e.translate[1]}px)`;
              e.target.setAttribute(
                'widget-pos2',
                `translate: ${e.translate[0]} | Round: ${
                  Math.round(e.translate[0] / gridWidth) * gridWidth
                } | ${gridWidth}`
              );
            }

            let draggedOverElemId;
            if (document.elementFromPoint(e.clientX, e.clientY)) {
              const targetElems = document.elementsFromPoint(e.clientX, e.clientY);
              // targetElems.forEach((e) => console.log('Element=>', { id: e.id, clist: e.classList, class: e.className }));
              // console.log(
              //   'draggedOverElem - list',
              //   targetElems,
              //   targetElems.filter(
              //     (ele) =>
              //       ele.id !== e.target.id &&
              //       (ele.classList.contains('target') || ele.classList.contains('nested-target'))
              //   )
              // );
              const draggedOverElem = targetElems.find(
                (ele) => ele.id !== e.target.id && ele.classList.contains('target')
              );
              setDragTarget(draggedOverElem?.id);
              console.log('draggedOverElem =>', draggedOverElem?.id, dragTarget);
              draggedOverElemId = draggedOverElem?.id;
            }
            console.log('draggedOverElemId parent', draggedOverElemId, parent);
            // onDrag([{ id: e.target.id, x: e.translate[0], y: e.translate[1], parent: draggedOverElemId }]);
          }}
          onDragGroup={({ events }) => {
            events.forEach((ev) => {
              console.log('Grouped data=>', ev);
              //   ev.target.style.transform = ev.transform;
            });
            onDrag(
              events.map((ev) => ({
                id: ev.target.id,
                x: ev.translate[0],
                y: ev.translate[1],
              }))
            );
          }}
          //snap settgins
          snappable={true}
          // snapDirections={{ top: true, left: true, bottom: true, right: true }}
          snapDirections={{ top: true, left: true, bottom: true, right: true, center: true, middle: true }}
          elementSnapDirections={{ top: true, left: true, bottom: true, right: true, center: true, middle: true }}
          snapThreshold={5}
          elementGuidelines={list.map((l) => ({ element: `.ele-${l.id}` }))}
          isDisplaySnapDigit={false}
          snapGridWidth={gridWidth}
          // snapGridHeight={10}
          // verticalGuidelines={[50, 150, 250, 450, 550]}
          // horizontalGuidelines={[0, 100, 200, 400, 500]}
        />
      </div>
    </div>
  );
}