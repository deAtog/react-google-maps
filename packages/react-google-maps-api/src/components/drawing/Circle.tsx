import {
  memo,
  useEffect,
  useContext,
  PureComponent,
  type ContextType,
  useMemo,
} from 'react'

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents,
} from '../../utils/helper.js'

import MapContext from '../../map-context.js'

const eventMap = {
  onCenterChanged: 'center_changed',
  onRadiusChanged: 'radius_changed',
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
  center(instance: google.maps.Circle, center: google.maps.LatLng): void {
    instance.setCenter(center)
  },
  draggable(instance: google.maps.Circle, draggable: boolean): void {
    instance.setDraggable(draggable)
  },
  editable(instance: google.maps.Circle, editable: boolean): void {
    instance.setEditable(editable)
  },
  map(instance: google.maps.Circle, map: google.maps.Map): void {
    instance.setMap(map)
  },
  options(
    instance: google.maps.Circle,
    options: google.maps.CircleOptions
  ): void {
    instance.setOptions(options)
  },
  radius(instance: google.maps.Circle, radius: number): void {
    instance.setRadius(radius)
  },
  visible(instance: google.maps.Circle, visible: boolean): void {
    instance.setVisible(visible)
  },
}

type CircleState = {
  circle: google.maps.Circle | null
}

export type CircleProps = {
  options?: google.maps.CircleOptions | undefined

  /** sets the center of the circle */
  center?: google.maps.LatLng | google.maps.LatLngLiteral | undefined

  // required
  /** Sets the radius of this circle (in meters) */
  radius?: number | undefined
  /** If set to true, the user can drag this circle over the map */
  draggable?: boolean | undefined
  /** If set to true, the user can edit this circle by dragging the control points shown at the center and around the circumference of the circle. */
  editable?: boolean | undefined
  /** Hides this circle if set to false. */
  visible?: boolean | undefined
  /** This event is fired when the DOM dblclick event is fired on the circle. */
  onDblClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user stops dragging the circle. */
  onDragEnd?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /**  This event is fired when the user starts dragging the circle. */
  onDragStart?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mousedown event is fired on the circle. */
  onMouseDown?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mousemove event is fired on the circle. */
  onMouseMove?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired on circle mouseout. */
  onMouseOut?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired on circle mouseover. */
  onMouseOver?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mouseup event is fired on the circle. */
  onMouseUp?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the circle is right-clicked on. */
  onRightClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM click event is fired on the circle. */
  onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is repeatedly fired while the user drags the circle. */
  onDrag?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the circle's center is changed. */
  onCenterChanged?: (() => void) | undefined
  /** This event is fired when the circle's radius is changed. */
  onRadiusChanged?: (() => void) | undefined
  /** This callback is called when the circle instance has loaded. It is called with the circle instance. */
  onLoad?: ((circle: google.maps.Circle) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the circle instance. */
  onUnmount?: ((circle: google.maps.Circle) => void) | undefined
}

const defaultOptions = {}

function CircleFunctional({
  options,
  center,
  radius,
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
  onCenterChanged,
  onRadiusChanged,
  onLoad,
  onUnmount,
}: CircleProps): null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const instance = useMemo(() => {
    return new google.maps.Circle({
      ...(options || defaultOptions),
      map,
    })
  }, []);

  // Order does matter
   useEffect(() => {
    if (typeof options === 'undefined') return;

    instance.setOptions(options);
  }, [instance, options])

  useEffect(() => {
    if (typeof draggable === 'undefined') return;

    instance.setDraggable(draggable);
  }, [instance, draggable])

  useEffect(() => {
    if (typeof editable === 'undefined') return;

    instance.setEditable(editable);
  }, [instance, editable])

  useEffect(() => {
    if (typeof visible === 'undefined') return;

    instance.setVisible(visible);
  }, [instance, visible])

  useEffect(() => {
    if (typeof radius !== 'number') return;

    instance.setRadius(radius);
  }, [instance, radius])

  useEffect(() => {
    if (typeof center === 'undefined') return;

    instance.setCenter(center);
  }, [instance, center])

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
    if (!onCenterChanged) return;

    const handler = google.maps.event.addListener(instance, 'center_changed', onCenterChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onClick])

  useEffect(() => {
    if (!onRadiusChanged) return;

    const handler = google.maps.event.addListener(instance, 'radius_changed', onRadiusChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onRadiusChanged])

  useEffect(() => {
    if (!map) return;

    instance.setMap(map)

    return () => {
      instance.setMap(null);
    }
  }, [instance, map])

  useEffect(() => {
    if (!onLoad) return;

    onLoad(instance)
  }, [instance, onLoad])

  useEffect(() => {
    if (!onUnmount) return;

    return () => {
      onUnmount(instance);
    }
  }, [instance, onUnmount])

  return null
}

export const CircleF = memo(CircleFunctional)

export class Circle extends PureComponent<CircleProps, CircleState> {
  static override contextType = MapContext
  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []

  override state: CircleState = {
    circle: null,
  }

  setCircleCallback = (): void => {
    if (this.state.circle !== null && this.props.onLoad) {
      this.props.onLoad(this.state.circle)
    }
  }

  override componentDidMount(): void {
    const circle = new google.maps.Circle({
      ...this.props.options,
      map: this.context,
    })

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: circle,
    })

    this.setState(function setCircle() {
      return {
        circle,
      }
    }, this.setCircleCallback)
  }

  override componentDidUpdate(prevProps: CircleProps): void {
    if (this.state.circle !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.circle,
      })
    }
  }

  override componentWillUnmount(): void {
    if (this.state.circle !== null) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.circle)
      }

      unregisterEvents(this.registeredEvents)

      this.state.circle?.setMap(null)
    }
  }

  override render(): null {
    return null
  }
}

export default Circle
