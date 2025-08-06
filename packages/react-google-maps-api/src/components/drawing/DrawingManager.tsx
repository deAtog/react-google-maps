/* globals google */
import {
  memo,
  useEffect,
  useContext,
  PureComponent,
  type ContextType,
  useMemo,
} from 'react'

import invariant from 'invariant'

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents,
} from '../../utils/helper.js'

import MapContext from '../../map-context.js'

const eventMap = {
  onCircleComplete: 'circlecomplete',
  onMarkerComplete: 'markercomplete',
  onOverlayComplete: 'overlaycomplete',
  onPolygonComplete: 'polygoncomplete',
  onPolylineComplete: 'polylinecomplete',
  onRectangleComplete: 'rectanglecomplete',
}

const updaterMap = {
  drawingMode(
    instance: google.maps.drawing.DrawingManager,
    drawingMode: google.maps.drawing.OverlayType | null
  ): void {
    instance.setDrawingMode(drawingMode)
  },
  options(
    instance: google.maps.drawing.DrawingManager,
    options: google.maps.drawing.DrawingManagerOptions
  ): void {
    instance.setOptions(options)
  },
}

type DrawingManagerState = {
  drawingManager: google.maps.drawing.DrawingManager | null
}

export type DrawingManagerProps = {
  options?: google.maps.drawing.DrawingManagerOptions | undefined
  /** Changes the DrawingManager's drawing mode, which defines the type of overlay to be added on the map. Accepted values are 'marker', 'polygon', 'polyline', 'rectangle', 'circle', or null. A drawing mode of null means that the user can interact with the map as normal, and clicks do not draw anything. */
  drawingMode?: google.maps.drawing.OverlayType | null | undefined
  /** This event is fired when the user has finished drawing a circle. */
  onCircleComplete?: ((circle: google.maps.Circle) => void) | undefined
  /** This event is fired when the user has finished drawing a marker. */
  onMarkerComplete?: ((marker: google.maps.Marker) => void) | undefined
  /** This event is fired when the user has finished drawing an overlay of any type. */
  onOverlayComplete?:
    | ((e: google.maps.drawing.OverlayCompleteEvent) => void)
    | undefined
  /** This event is fired when the user has finished drawing a polygon. */
  onPolygonComplete?: ((polygon: google.maps.Polygon) => void) | undefined
  /** This event is fired when the user has finished drawing a polyline. */
  onPolylineComplete?: ((polyline: google.maps.Polyline) => void) | undefined
  /** This event is fired when the user has finished drawing a rectangle. */
  onRectangleComplete?: ((rectangle: google.maps.Rectangle) => void) | undefined
  /** This callback is called when the drawingManager instance has loaded. It is called with the drawingManager instance. */
  onLoad?:
    | ((drawingManager: google.maps.drawing.DrawingManager) => void)
    | undefined
  /** This callback is called when the component unmounts. It is called with the drawingManager instance. */
  onUnmount?:
    | ((drawingManager: google.maps.drawing.DrawingManager) => void)
    | undefined
}

function DrawingManagerFunctional({
  options,
  drawingMode,
  onCircleComplete,
  onMarkerComplete,
  onOverlayComplete,
  onPolygonComplete,
  onPolylineComplete,
  onRectangleComplete,
  onLoad,
  onUnmount,
}: DrawingManagerProps): null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const instance = useMemo(() => {
    invariant(
      !!google.maps.drawing,
      `Did you include prop libraries={['drawing']} in the URL? %s`,
      google.maps.drawing
    )

    return new google.maps.drawing.DrawingManager({
      ...options,
      map,
    });
  }, [])

  // Order does matter
  useEffect(() => {
    if (!instance || !map) return;

    instance.setMap(map);

    return () => {
      instance.setMap(null);
    }
  }, [map])

  useEffect(() => {
    if (!instance || !options) return;

    instance.setOptions(options);
  }, [instance, options])

  useEffect(() => {
    if (!instance) return;

    instance.setDrawingMode(drawingMode ?? null);
  }, [instance, drawingMode])

  useEffect(() => {
    if (!instance || !onCircleComplete) return;

    const handler = google.maps.event.addListener(instance, 'circlecomplete', onCircleComplete);

    return () => {
      handler.remove();
    }
  }, [instance, onCircleComplete])

  useEffect(() => {
    if (!instance || !onMarkerComplete) return;

    const handler = google.maps.event.addListener(instance, 'markercomplete', onMarkerComplete);

    return () => {
      handler.remove();
    }
  }, [instance, onMarkerComplete])

  useEffect(() => {
    if (!instance || !onOverlayComplete) return;

    const handler = google.maps.event.addListener(instance, 'overlaycomplete', onOverlayComplete);

    return () => {
      handler.remove();
    }
  }, [instance, onOverlayComplete])

  useEffect(() => {
    if (!instance || !onPolygonComplete) return;

    const handler = google.maps.event.addListener(instance, 'polygoncomplete', onPolygonComplete);

    return () => {
      handler.remove();
    }
  }, [instance, onPolygonComplete])

  useEffect(() => {
    if (!instance || !onPolylineComplete) return;

    const handler = google.maps.event.addListener(instance, 'polylinecomplete', onPolylineComplete);

    return () => {
      handler.remove();
    }
  }, [instance, onPolylineComplete])

  useEffect(() => {
    if (!instance || !onRectangleComplete) return;

    const handler = google.maps.event.addListener(instance, 'rectanglecomplete', onRectangleComplete);

    return () => {
      handler.remove();
    }
  }, [instance, onRectangleComplete])

  useEffect(() => {
    if (!instance || !onLoad) return;

    onLoad(instance);
  }, [instance, onLoad])

  useEffect(() => {
    if (!instance || !onUnmount) return;

    return () => {
      onUnmount(instance);
    }
  }, [instance, onUnmount])

  return null
}

export const DrawingManagerF = memo(DrawingManagerFunctional)

export class DrawingManager extends PureComponent<
  DrawingManagerProps,
  DrawingManagerState
> {
  static override contextType = MapContext

  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []

  override state: DrawingManagerState = {
    drawingManager: null,
  }

  constructor(props: DrawingManagerProps) {
    super(props)

    invariant(
      !!google.maps.drawing,
      `Did you include prop libraries={['drawing']} in the URL? %s`,
      google.maps.drawing
    )
  }

  setDrawingManagerCallback = (): void => {
    if (this.state.drawingManager !== null && this.props.onLoad) {
      this.props.onLoad(this.state.drawingManager)
    }
  }

  override componentDidMount(): void {
    const drawingManager = new google.maps.drawing.DrawingManager({
      ...this.props.options,
      map: this.context,
    })

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: drawingManager,
    })

    this.setState(function setDrawingManager() {
      return {
        drawingManager,
      }
    }, this.setDrawingManagerCallback)
  }

  override componentDidUpdate(prevProps: DrawingManagerProps): void {
    if (this.state.drawingManager !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.drawingManager,
      })
    }
  }

  override componentWillUnmount(): void {
    if (this.state.drawingManager !== null) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.drawingManager)
      }

      unregisterEvents(this.registeredEvents)

      this.state.drawingManager.setMap(null)
    }
  }

  override render(): null {
    return null
  }
}

export default DrawingManager
