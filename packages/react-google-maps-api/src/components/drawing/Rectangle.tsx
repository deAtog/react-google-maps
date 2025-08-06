import {
  memo,
  useEffect,
  useContext,
  useMemo,
  PureComponent,
  type ContextType,
} from 'react'

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents,
} from '../../utils/helper.js'

import MapContext from '../../map-context.js'

const eventMap = {
  onBoundsChanged: 'bounds_changed',
  onClick: 'click',
  onDblClick: 'dblclick',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onDragStart: 'dragstart',
  onMouseDown: 'mousedown',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
  onRightClick: 'rightclick',
}

const updaterMap = {
  bounds(
    instance: google.maps.Rectangle,
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
  ): void {
    instance.setBounds(bounds)
  },
  draggable(instance: google.maps.Rectangle, draggable: boolean): void {
    instance.setDraggable(draggable)
  },
  editable(instance: google.maps.Rectangle, editable: boolean): void {
    instance.setEditable(editable)
  },
  map(instance: google.maps.Rectangle, map: google.maps.Map): void {
    instance.setMap(map)
  },
  options(
    instance: google.maps.Rectangle,
    options: google.maps.RectangleOptions
  ): void {
    instance.setOptions(options)
  },
  visible(instance: google.maps.Rectangle, visible: boolean): void {
    instance.setVisible(visible)
  },
}

type RectangleState = {
  rectangle: google.maps.Rectangle | null
}

export type RectangleProps = {
  options?: google.maps.RectangleOptions | undefined
  /** Sets the bounds of this rectangle. */
  bounds?:
    | google.maps.LatLngBounds
    | google.maps.LatLngBoundsLiteral
    | undefined
  /** If set to true, the user can drag this rectangle over the map. */
  draggable?: boolean | undefined
  /** If set to true, the user can edit this rectangle by dragging the control points shown at the corners and on each edge. */
  editable?: boolean | undefined
  /** Hides this rectangle if set to false. */
  visible?: boolean | undefined
  /** @deprecated Indicates whether this Rectangle handles mouse events. Defaults to true. Does not exist on RectangleF component. In google-maps-api types it belongs to options! update options.clickable instead! */
  clickable?: boolean | undefined
  /** This event is fired when the DOM dblclick event is fired on the rectangle. */
  onDblClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user stops dragging the rectangle. */
  onDragEnd?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user starts dragging the rectangle. */
  onDragStart?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mousedown event is fired on the rectangle. */
  onMouseDown?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mousemove event is fired on the rectangle. */
  onMouseMove?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired on rectangle mouseout. */
  onMouseOut?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired on rectangle mouseover. */
  onMouseOver?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mouseup event is fired on the rectangle. */
  onMouseUp?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the rectangle is right-clicked on. */
  onRightClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM click event is fired on the rectangle. */
  onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is repeatedly fired while the user drags the rectangle. */
  onDrag?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the rectangle's bounds are changed. */
  onBoundsChanged?: (() => void) | undefined
  /** This callback is called when the rectangle instance has loaded. It is called with the rectangle instance. */
  onLoad?: ((rectangle: google.maps.Rectangle) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the rectangle instance. */
  onUnmount?: ((rectangle: google.maps.Rectangle) => void) | undefined
}

function RectangleFunctional({
  options,
  bounds,
  draggable,
  editable,
  visible,
  onDblClick,
  onDragEnd,
  onDragStart,
  onMouseDown,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onRightClick,
  onClick,
  onDrag,
  onBoundsChanged,
  onLoad,
  onUnmount,
}: RectangleProps): null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const instance = useMemo(() => {
    return new google.maps.Rectangle({
      ...options,
      map,
    });
  }, [])

  // Order does matter
  useEffect(() => {
    instance.setMap(map)

    return () => {
      instance.setMap(null);
    }
  }, [instance, map])

  useEffect(() => {
    if (!options) return;

    instance.setOptions(options)
  }, [instance, options])

  useEffect(() => {
    if (typeof draggable === 'undefined') return;

    instance.setDraggable(draggable)
  }, [instance, draggable])

  useEffect(() => {
    if (typeof editable === 'undefined') return;

    instance.setEditable(editable)
  }, [instance, editable])

  useEffect(() => {
    if (typeof visible === 'undefined') return;

    instance.setVisible(visible)
  }, [instance, visible])

  useEffect(() => {
    if (typeof bounds === 'undefined') return;

    instance.setBounds(bounds)
  }, [instance, bounds])

  useEffect(() => {
    if (!onDblClick) return;

    const handler = google.maps.event.addListener(instance, 'dblclick', onDblClick);

    return () => {
      handler.remove();
    }
  }, [instance, onDblClick])

  useEffect(() => {
    if (!onDragEnd) return;

    const handler = google.maps.event.addListener(instance, 'dragend', onDragEnd);

    return () => {
      handler.remove();
    }
  }, [instance, onDragEnd])

  useEffect(() => {
    if (!onDragStart) return;

    const handler = google.maps.event.addListener(instance, 'dragstart', onDragStart);

    return () => {
      handler.remove();
    }
  }, [instance, onDragStart])

  useEffect(() => {
    if (!onMouseDown) return;

    const handler = google.maps.event.addListener(instance, 'mousedown', onMouseDown);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseDown])

  useEffect(() => {
    if (!onMouseMove) return;

    const handler = google.maps.event.addListener(instance, 'mousemove', onMouseMove);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseMove])

  useEffect(() => {
    if (!onMouseOut) return;

    const handler = google.maps.event.addListener(instance, 'mouseout', onMouseOut);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseOut])

  useEffect(() => {
    if (!onMouseOver) return;

    const handler = google.maps.event.addListener(instance, 'mouseover', onMouseOver);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseOver])

  useEffect(() => {
    if (!onMouseUp) return;

    const handler = google.maps.event.addListener(instance, 'mouseup', onMouseUp);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseUp])

  useEffect(() => {
    if (!onRightClick) return;

    const handler = google.maps.event.addListener(instance, 'rightclick', onRightClick);

    return () => {
      handler.remove();
    }
  }, [instance, onRightClick])

  useEffect(() => {
    if (!onClick) return;

    const handler = google.maps.event.addListener(instance, 'click', onClick);

    return () => {
      handler.remove();
    }
  }, [instance, onClick])

  useEffect(() => {
    if (!onDrag) return;

    const handler = google.maps.event.addListener(instance, 'drag', onDrag);

    return () => {
      handler.remove();
    }
  }, [instance, onDrag])

  useEffect(() => {
    if (!onBoundsChanged) return;

    const handler = google.maps.event.addListener(instance, 'bounds_changed', onBoundsChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onBoundsChanged])

  useEffect(() => {
    if (!onLoad) return;

    onLoad(instance);
  }, [instance, onLoad])

  useEffect(() => {
    if (!onUnmount) return;

    return () => {
      onUnmount(instance);
    }
  }, [instance, onUnmount])

  return null
}

export const RectangleF = memo(RectangleFunctional)

export class Rectangle extends PureComponent<RectangleProps, RectangleState> {
  static override contextType = MapContext

  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []

  override state: RectangleState = {
    rectangle: null,
  }

  setRectangleCallback = (): void => {
    if (this.state.rectangle !== null && this.props.onLoad) {
      this.props.onLoad(this.state.rectangle)
    }
  }

  override componentDidMount(): void {
    const rectangle = new google.maps.Rectangle({
      ...this.props.options,
      map: this.context,
    })

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: rectangle,
    })

    this.setState(function setRectangle() {
      return {
        rectangle,
      }
    }, this.setRectangleCallback)
  }

  override componentDidUpdate(prevProps: RectangleProps): void {
    if (this.state.rectangle !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.rectangle,
      })
    }
  }

  override componentWillUnmount(): void {
    if (this.state.rectangle !== null) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.rectangle)
      }

      unregisterEvents(this.registeredEvents)

      this.state.rectangle.setMap(null)
    }
  }

  override render(): null {
    return null
  }
}

export default Rectangle
