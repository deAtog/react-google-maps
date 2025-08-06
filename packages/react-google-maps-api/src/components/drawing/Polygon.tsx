/* global google */
import {
  memo,
  useState,
  useEffect,
  useContext,
  PureComponent,
  type ContextType,
} from 'react'

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents,
} from '../../utils/helper.js'

import MapContext from '../../map-context.js'

const eventMap = {
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
  draggable(instance: google.maps.Polygon, draggable: boolean): void {
    instance.setDraggable(draggable)
  },
  editable(instance: google.maps.Polygon, editable: boolean): void {
    instance.setEditable(editable)
  },
  map(instance: google.maps.Polygon, map: google.maps.Map): void {
    instance.setMap(map)
  },
  options(
    instance: google.maps.Polygon,
    options: google.maps.PolygonOptions
  ): void {
    instance.setOptions(options)
  },
  path(
    instance: google.maps.Polygon,
    path:
      | google.maps.MVCArray<google.maps.LatLng>
      | google.maps.LatLng[]
      | google.maps.LatLngLiteral[]
  ): void {
    instance.setPath(path)
  },

  paths(
    instance: google.maps.Polygon,
    paths:
      | google.maps.MVCArray<google.maps.LatLng>
      | google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
      | google.maps.LatLng[]
      | google.maps.LatLng[][]
      | google.maps.LatLngLiteral[]
      | google.maps.LatLngLiteral[][]
  ): void {
    instance.setPaths(paths)
  },

  visible(instance: google.maps.Polygon, visible: boolean): void {
    instance.setVisible(visible)
  },
}

export type PolygonProps = {
  options?: google.maps.PolygonOptions | undefined
  /** If set to true, the user can drag this shape over the map. The geodesic property defines the mode of dragging. */
  draggable?: boolean | undefined
  /** If set to true, the user can edit this shape by dragging the control points shown at the vertices and on each segment. */
  editable?: boolean | undefined
  /** Hides this poly if set to false. */
  visible?: boolean | undefined
  /** Sets the first path. See Paths for more details. */
  path?:
    | google.maps.MVCArray<google.maps.LatLng>
    | google.maps.LatLng[]
    | google.maps.LatLngLiteral[]
    | undefined
  /** Sets the path for this polygon. The ordered sequence of coordinates that designates a closed loop. Unlike polylines, a polygon may consist of one or more paths. As a result, the paths property may specify one or more arrays of LatLng coordinates. Paths are closed automatically; do not repeat the first vertex of the path as the last vertex. Simple polygons may be defined using a single array of LatLngs. More complex polygons may specify an array of arrays. Any simple arrays are converted into MVCArrays. Inserting or removing LatLngs from the MVCArray will automatically update the polygon on the map. */
  paths?:
    | google.maps.MVCArray<google.maps.LatLng>
    | google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
    | google.maps.LatLng[]
    | google.maps.LatLng[][]
    | google.maps.LatLngLiteral[]
    | google.maps.LatLngLiteral[][]
    | undefined
  /** This event is fired when the DOM dblclick event is fired on the Polygon. */
  onDblClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user stops dragging the polygon. */
  onDragEnd?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user starts dragging the polygon. */
  onDragStart?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mousedown event is fired on the Polygon. */
  onMouseDown?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mousemove event is fired on the Polygon. */
  onMouseMove?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired on Polygon mouseout. */
  onMouseOut?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired on Polygon mouseover. */
  onMouseOver?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM mouseup event is fired on the Polygon. */
  onMouseUp?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the Polygon is right-clicked on. */
  onRightClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the DOM click event is fired on the Polygon. */
  onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is repeatedly fired while the user drags the polygon. */
  onDrag?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This callback is called when the polygon instance has loaded. It is called with the polygon instance. */
  onLoad?: ((polygon: google.maps.Polygon) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the polygon instance. */
  onUnmount?: ((polygon: google.maps.Polygon) => void) | undefined
  /** This callback is called when the components editing is finished */
  onEdit?: ((polygon: google.maps.Polygon) => void) | undefined
}

function PolygonFunctional({
  options,
  draggable,
  editable,
  visible,
  path,
  paths,
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
  onLoad,
  onUnmount,
  onEdit,
}: PolygonProps): null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const [instance, setInstance] = useState<google.maps.Polygon | null>(null)

  // Order does matter
  useEffect(() => {
    if (!instance) return;

    instance.setMap(map)
  }, [map])

  useEffect(() => {
    if (!instance || options === undefined) return;

    instance.setOptions(options)
  }, [instance, options])

  useEffect(() => {
    if (!instance || draggable === undefined) return;

    instance.setDraggable(draggable)
  }, [instance, draggable])

  useEffect(() => {
    if (!instance || editable === undefined) return;

    instance.setEditable(editable)
  }, [instance, editable])

  useEffect(() => {
    if (!instance || visible === undefined) return;

    instance.setVisible(visible)
  }, [instance, visible])

  useEffect(() => {
    if (!instance || !path) return;

    instance.setPath(path)
  }, [instance, path])

  useEffect(() => {
    if (!instance || !paths) return;

    instance.setPaths(paths)
  }, [instance, paths])

  useEffect(() => {
    if (!instance || !onDblClick) return;

    const handler = google.maps.event.addListener(instance, 'dblclick', onDblClick);

    return () => {
      handler.remove();
    }
  }, [instance, onDblClick])

  useEffect(() => {
    if (!instance || !onEdit) return;

    const hInsertAt = google.maps.event.addListener(instance.getPath(), 'insert_at', () => {
      onEdit(instance)
    })

    const hSetAt = google.maps.event.addListener(instance.getPath(), 'set_at', () => {
      onEdit(instance)
    })

    const hRemoveAt = google.maps.event.addListener(instance.getPath(), 'remove_at', () => {
      onEdit(instance)
    })

    return () => {
      hInsertAt.remove();
      hSetAt.remove();
      hRemoveAt.remove();
    }
  }, [instance, onEdit])

  useEffect(() => {
    if (!instance || !onDragEnd) return;

    const handler = google.maps.event.addListener(instance, 'dragend', onDragEnd);

    return () => {
      handler.remove();
    }
  }, [instance, onDragEnd])

  useEffect(() => {
    if (!instance || !onDragStart) return;

    const handler = google.maps.event.addListener(instance, 'dragstart', onDragStart);

    return () => {
      handler.remove();
    }
  }, [instance, onDragStart])

  useEffect(() => {
    if (!instance || !onMouseDown) return;

    const handler = google.maps.event.addListener(instance, 'mousedown', onMouseDown);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseDown])

  useEffect(() => {
    if (!instance || !onMouseMove) return;

    const handler = google.maps.event.addListener(instance, 'mousemove', onMouseMove);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseMove])

  useEffect(() => {
    if (!instance || !onMouseOut) return;

    const handler = google.maps.event.addListener(instance, 'mouseout', onMouseOut);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseOut])

  useEffect(() => {
    if (!instance || !onMouseOver) return;

    const handler = google.maps.event.addListener(instance, 'mouseover', onMouseOver);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseOver])

  useEffect(() => {
    if (!instance || !onMouseUp) return;

    const handler = google.maps.event.addListener(instance, 'mouseup', onMouseUp);

    return () => {
      handler.remove();
    }
  }, [instance, onMouseUp])

  useEffect(() => {
    if (!instance || !onRightClick) return;

    const handler = google.maps.event.addListener(instance, 'rightclick', onRightClick);

    return () => {
      handler.remove();
    }
  }, [instance, onRightClick])

  useEffect(() => {
    if (!instance || !onClick) return;

    const handler = google.maps.event.addListener(instance, 'click', onClick);

    return () => {
      handler.remove();
    }
  }, [instance, onClick])

  useEffect(() => {
    if (!instance || !onDrag) return;

    const handler = google.maps.event.addListener(instance, 'drag', onDrag);

    return () => {
      handler.remove();
    }
  }, [instance, onDrag])

  useEffect(() => {
    const polygon = new google.maps.Polygon({
      ...options,
      map,
    })


    setInstance(polygon)

    if (onLoad) {
      onLoad(polygon)
    }

    return () => {
      if (onUnmount) {
        onUnmount(polygon)
      }

      polygon.setMap(null)
    }
  }, [])

  return null
}

export const PolygonF = memo(PolygonFunctional)

export class Polygon extends PureComponent<PolygonProps> {
  static override contextType = MapContext
  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []

  polygon: google.maps.Polygon | undefined

  override componentDidMount(): void {
    const polygonOptions = this.props.options || {}

    this.polygon = new google.maps.Polygon(polygonOptions)

    this.polygon.setMap(this.context)

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: this.polygon,
    })

    if (this.props.onLoad) {
      this.props.onLoad(this.polygon)
    }
  }

  override componentDidUpdate(prevProps: PolygonProps): void {
    if (this.polygon) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.polygon,
      })
    }
  }

  override componentWillUnmount(): void {
    if (this.polygon) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.polygon)
      }

      unregisterEvents(this.registeredEvents)

      if (this.polygon) {
        this.polygon.setMap(null)
      }
    }
  }

  override render(): null {
    return null
  }
}

export default Polygon
