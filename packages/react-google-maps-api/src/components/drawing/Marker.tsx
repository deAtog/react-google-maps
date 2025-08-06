import {
  memo,
  useMemo,
  Children,
  useState,
  type JSX,
  useEffect,
  useContext,
  cloneElement,
  PureComponent,
  isValidElement,
  type ReactNode,
  type ContextType,
  type ReactElement,
} from 'react'
import type { Clusterer } from '@react-google-maps/marker-clusterer'
import type { MarkerClusterer as GoogleClusterer } from '@googlemaps/markerclusterer'

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents,
} from '../../utils/helper.js'

import MapContext from '../../map-context.js'
import type { HasMarkerAnchor } from '../../types.js'

const eventMap = {
  onAnimationChanged: 'animation_changed',
  onClick: 'click',
  onClickableChanged: 'clickable_changed',
  onCursorChanged: 'cursor_changed',
  onDblClick: 'dblclick',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onDraggableChanged: 'draggable_changed',
  onDragStart: 'dragstart',
  onFlatChanged: 'flat_changed',
  onIconChanged: 'icon_changed',
  onMouseDown: 'mousedown',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
  onPositionChanged: 'position_changed',
  onRightClick: 'rightclick',
  onShapeChanged: 'shape_changed',
  onTitleChanged: 'title_changed',
  onVisibleChanged: 'visible_changed',
  onZindexChanged: 'zindex_changed',
}

const updaterMap = {
  animation(
    instance: google.maps.Marker,
    animation: google.maps.Animation
  ): void {
    instance.setAnimation(animation)
  },
  clickable(instance: google.maps.Marker, clickable: boolean): void {
    instance.setClickable(clickable)
  },
  cursor(instance: google.maps.Marker, cursor: string): void {
    instance.setCursor(cursor)
  },
  draggable(instance: google.maps.Marker, draggable: boolean): void {
    instance.setDraggable(draggable)
  },
  icon(
    instance: google.maps.Marker,
    icon: string | google.maps.Icon | google.maps.Symbol
  ): void {
    instance.setIcon(icon)
  },
  label(
    instance: google.maps.Marker,
    label: string | google.maps.MarkerLabel
  ): void {
    instance.setLabel(label)
  },
  map(instance: google.maps.Marker, map: google.maps.Map): void {
    instance.setMap(map)
  },
  opacity(instance: google.maps.Marker, opacity: number): void {
    instance.setOpacity(opacity)
  },
  options(
    instance: google.maps.Marker,
    options: google.maps.MarkerOptions
  ): void {
    instance.setOptions(options)
  },
  position(
    instance: google.maps.Marker,
    position: google.maps.LatLng | google.maps.LatLngLiteral
  ): void {
    instance.setPosition(position)
  },
  shape(instance: google.maps.Marker, shape: google.maps.MarkerShape): void {
    instance.setShape(shape)
  },
  title(instance: google.maps.Marker, title: string): void {
    instance.setTitle(title)
  },
  visible(instance: google.maps.Marker, visible: boolean): void {
    instance.setVisible(visible)
  },
  zIndex(instance: google.maps.Marker, zIndex: number): void {
    instance.setZIndex(zIndex)
  },
}

export type MarkerProps = {
  // required
  /** Marker position. */
  position: google.maps.LatLng | google.maps.LatLngLiteral

  children?: ReactNode | undefined
  options?: google.maps.MarkerOptions | undefined
  /** Start an animation. Any ongoing animation will be cancelled. Currently supported animations are: BOUNCE, DROP. Passing in null will cause any animation to stop. */
  animation?: google.maps.Animation | undefined
  /** If true, the marker receives mouse and touch events. Default value is true. */
  clickable?: boolean | undefined
  /** Mouse cursor to show on hover */
  cursor?: string | undefined
  /** If true, the marker can be dragged. Default value is false. */
  draggable?: boolean | undefined
  /** Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url. */
  icon?: string | google.maps.Icon | google.maps.Symbol | undefined
  /** Adds a label to the marker. The label can either be a string, or a MarkerLabel object. */
  label?: string | google.maps.MarkerLabel | undefined
  /** The marker's opacity between 0.0 and 1.0. */
  opacity?: number | undefined

  /** Image map region definition used for drag/click. */
  shape?: google.maps.MarkerShape | undefined
  /** Rollover text */
  title?: string | undefined
  /** If true, the marker is visible */
  visible?: boolean | undefined
  /** All markers are displayed on the map in order of their zIndex, with higher values displaying in front of markers with lower values. By default, markers are displayed according to their vertical position on screen, with lower markers appearing in front of markers further up the screen. */
  zIndex?: number | undefined
  /** Render prop that handles clustering markers */
  clusterer?: Clusterer | GoogleClusterer | undefined
  /** Clusters are redrawn when a Marker is added unless noClustererRedraw? is set to true. */
  noClustererRedraw?: boolean | undefined
  /** This event is fired when the marker icon was clicked. */
  onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker's clickable property changes. */
  onClickableChanged?: (() => void) | undefined
  /** This event is fired when the marker's cursor property changes. */
  onCursorChanged?: (() => void) | undefined
  /** This event is fired when the marker's animation property changes. */
  onAnimationChanged?: (() => void) | undefined
  /** This event is fired when the marker icon was double clicked. */
  onDblClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is repeatedly fired while the user drags the marker. */
  onDrag?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user stops dragging the marker. */
  onDragEnd?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker's draggable property changes. */
  onDraggableChanged?: (() => void) | undefined
  /** This event is fired when the user starts dragging the marker. */
  onDragStart?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker's flat property changes. */
  onFlatChanged?: (() => void) | undefined
  /** This event is fired when the marker icon property changes. */
  onIconChanged?: (() => void) | undefined
  /** This event is fired for a mousedown on the marker. */
  onMouseDown?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the mouse leaves the area of the marker icon. */
  onMouseOut?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the mouse enters the area of the marker icon. */
  onMouseOver?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired for a mouseup on the marker. */
  onMouseUp?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker position property changes. */
  onPositionChanged?: (() => void) | undefined
  /** This event is fired for a rightclick on the marker. */
  onRightClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker's shape property changes. */
  onShapeChanged?: (() => void) | undefined
  /** This event is fired when the marker title property changes. */
  onTitleChanged?: (() => void) | undefined
  /** This event is fired when the marker's visible property changes. */
  onVisibleChanged?: (() => void) | undefined
  /** This event is fired when the marker's zIndex property changes. */
  onZindexChanged?: (() => void) | undefined
  /** This callback is called when the marker instance has loaded. It is called with the marker instance. */
  onLoad?: ((marker: google.maps.Marker) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the marker instance. */
  onUnmount?: ((marker: google.maps.Marker) => void) | undefined
}

const defaultOptions = {}

function MarkerFunctional({
  position,
  options,
  clusterer,
  noClustererRedraw,

  children,

  draggable,
  visible,
  animation,
  clickable,
  cursor,
  icon,
  label,
  opacity,
  shape,
  title,
  zIndex,
  onClick,
  onDblClick,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onMouseDown,
  onRightClick,
  onClickableChanged,
  onCursorChanged,
  onAnimationChanged,
  onDraggableChanged,
  onFlatChanged,
  onIconChanged,
  onPositionChanged,
  onShapeChanged,
  onTitleChanged,
  onVisibleChanged,
  onZindexChanged,
  onLoad,
  onUnmount,
}: MarkerProps): JSX.Element | null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const [instance, setInstance] = useState<google.maps.Marker | null>(null)

  // Order does matter
  useEffect(() => {
    if (!instance) return;

    instance.setMap(map);
  }, [map])

  useEffect(() => {
    if (!instance || !options) return;

    instance.setOptions(options);
  }, [instance, options])

  useEffect(() => {
    if (!instance || draggable === undefined) return;

    instance.setDraggable(draggable);
  }, [instance, draggable])

  useEffect(() => {
    if (!instance || !position) return;

    instance.setPosition(position)
  }, [instance, position])

  useEffect(() => {
    if (!instance || visible === undefined) return;

    instance.setVisible(visible);
  }, [instance, visible])

  useEffect(() => {
    if (!instance) return;

    instance.setAnimation(animation);
  }, [instance, animation])

  useEffect(() => {
    if (!instance || clickable === undefined) return;

    instance.setClickable(clickable);
  }, [instance, clickable])

  useEffect(() => {
    if (!instance || cursor === undefined) return;

    instance.setCursor(cursor);
  }, [instance, cursor])

  useEffect(() => {
    if (!instance || icon === undefined) return;

    instance.setIcon(icon);
  }, [instance, icon])

  useEffect(() => {
    if (!instance || label === undefined) return;

    instance.setLabel(label);
  }, [instance, label])

  useEffect(() => {
    if (!instance || opacity === undefined) return;

    instance.setOpacity(opacity);
  }, [instance, opacity])

  useEffect(() => {
    if (!instance || shape === undefined) return;

    instance.setShape(shape);
  }, [instance, shape])

  useEffect(() => {
    if (!instance || title === undefined) return;

    instance.setTitle(title);
  }, [instance, title])

  useEffect(() => {
    if (!instance || zIndex === undefined) return;

    instance.setZIndex(zIndex)
  }, [instance, zIndex])

  useEffect(() => {
    if (!instance || !onDblClick) return;

    const handler = google.maps.event.addListener(instance, 'dblclick', onDblClick);

    return () => {
      handler.remove();
    }
  }, [instance, onDblClick])

  useEffect(() => {
    if (!instance || !onDragEnd) return;

    const handler = google.maps.event.addListener(instance, 'dragend', onDragEnd)

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
    if (!instance || !onClickableChanged) return;

    const handler = google.maps.event.addListener(instance, 'clickable_changed', onClickableChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onClickableChanged])

  useEffect(() => {
    if (!instance || !onCursorChanged) return;

    const handler = google.maps.event.addListener(instance, 'cursor_changed', onCursorChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onCursorChanged])

  useEffect(() => {
    if (!instance || !onAnimationChanged) return;

    const handler = google.maps.event.addListener(instance, 'animation_changed', onAnimationChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onAnimationChanged])

  useEffect(() => {
    if (!instance || !onDraggableChanged) return;

    const handler = google.maps.event.addListener(instance, 'draggable_changed', onDraggableChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onDraggableChanged])

  useEffect(() => {
    if (!instance || !onFlatChanged) return;

    const handler = google.maps.event.addListener(instance, 'flat_changed', onFlatChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onFlatChanged])

  useEffect(() => {
    if (!instance || !onIconChanged) return;

    const handler = google.maps.event.addListener(instance, 'icon_changed', onIconChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onIconChanged])

  useEffect(() => {
    if (!instance || !onPositionChanged) return;

    const handler = google.maps.event.addListener(instance, 'position_changed', onPositionChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onPositionChanged])

  useEffect(() => {
    if (!instance || !onShapeChanged) return;

    const handler = google.maps.event.addListener(instance, 'shape_changed', onShapeChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onShapeChanged])

  useEffect(() => {
    if (!instance || !onTitleChanged) return;

    const handler = google.maps.event.addListener(instance, 'title_changed', onTitleChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onTitleChanged])

  useEffect(() => {
    if (!instance || !onVisibleChanged) return;

    const handler = google.maps.event.addListener(instance, 'visible_changed', onVisibleChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onVisibleChanged])

  useEffect(() => {
    if (!instance || !onZindexChanged) return;

    const handler = google.maps.event.addListener(instance, 'zindex_changed', onZindexChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onZindexChanged])

  useEffect(() => {
    const markerOptions = {
      ...(options || defaultOptions),
      ...(clusterer ? defaultOptions : { map }),
      position,
    }

    const marker = new google.maps.Marker(markerOptions)

    if (clusterer) {
      clusterer.addMarker(marker, !!noClustererRedraw)
    } else {
      marker.setMap(map)
    }

    if (position) {
      marker.setPosition(position)
    }

    if (typeof visible !== 'undefined') {
      marker.setVisible(visible)
    }

    if (typeof draggable !== 'undefined') {
      marker.setDraggable(draggable)
    }

    if (typeof clickable !== 'undefined') {
      marker.setClickable(clickable)
    }

    if (typeof cursor === 'string') {
      marker.setCursor(cursor)
    }

    if (icon) {
      marker.setIcon(icon)
    }

    if (typeof label !== 'undefined') {
      marker.setLabel(label)
    }

    if (typeof opacity !== 'undefined') {
      marker.setOpacity(opacity)
    }

    if (shape) {
      marker.setShape(shape)
    }

    if (typeof title === 'string') {
      marker.setTitle(title)
    }

    if (typeof zIndex === 'number') {
      marker.setZIndex(zIndex)
    }

    setInstance(marker)

    if (onLoad) {
      onLoad(marker)
    }

    return () => {
      if (onUnmount) {
        onUnmount(marker)
      }

      if (clusterer) {
        clusterer.removeMarker(marker, !!noClustererRedraw)
      } else if (marker) {
        marker.setMap(null)
      }
    }
  }, [])

  const chx = useMemo<ReactNode | null>(() => {
    return children
      ? Children.map(children, (child) => {
          if (!isValidElement<HasMarkerAnchor>(child)) {
            return child
          }

          const elementChild: ReactElement<HasMarkerAnchor> = child

          return cloneElement(elementChild, { anchor: instance })
        })
      : null
  }, [children, instance])

  return <>{chx}</> || null
}

export const MarkerF = memo(MarkerFunctional)

export class Marker extends PureComponent<MarkerProps> {
  static override contextType = MapContext
  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []

  marker: google.maps.Marker | undefined

  override async componentDidMount(): Promise<void> {
    const markerOptions = {
      ...(this.props.options || defaultOptions),
      ...(this.props.clusterer ? defaultOptions : { map: this.context }),
      position: this.props.position,
    }

    // Unfortunately we can't just do this in the contstructor, because the
    // `MapContext` might not be filled in yet.
    this.marker = new google.maps.Marker(markerOptions)

    if (this.props.clusterer) {
      this.props.clusterer.addMarker(
        this.marker,
        !!this.props.noClustererRedraw
      )
    } else {
      this.marker.setMap(this.context)
    }

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: this.marker,
    })

    if (this.props.onLoad) {
      this.props.onLoad(this.marker)
    }
  }

  override componentDidUpdate(prevProps: MarkerProps): void {
    if (this.marker) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.marker,
      })
    }
  }

  override componentWillUnmount(): void {
    if (!this.marker) {
      return
    }

    if (this.props.onUnmount) {
      this.props.onUnmount(this.marker)
    }

    unregisterEvents(this.registeredEvents)

    if (this.props.clusterer) {
      this.props.clusterer.removeMarker(
        this.marker,
        !!this.props.noClustererRedraw
      )
    } else if (this.marker) {
      this.marker.setMap(null)
    }
  }

  override render(): ReactNode {
    const children: ReactNode | null = this.props.children
      ? Children.map(this.props.children, (child) => {
          if (!isValidElement<HasMarkerAnchor>(child)) {
            return child
          }

          const elementChild: ReactElement<HasMarkerAnchor> = child

          return cloneElement(elementChild, { anchor: this.marker })
        })
      : null

    return children || null
  }
}

export default Marker
