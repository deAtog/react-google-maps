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
  onMouseDown: 'mousedown',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
  onRightClick: 'rightclick',
  onAddFeature: 'addfeature',
  onRemoveFeature: 'removefeature',
  onRemoveProperty: 'removeproperty',
  onSetGeometry: 'setgeometry',
  onSetProperty: 'setproperty',
}

const updaterMap = {
  add(
    instance: google.maps.Data,
    feature: google.maps.Data.Feature | google.maps.Data.FeatureOptions
  ): void {
    instance.add(feature)
  },
  addgeojson(
    instance: google.maps.Data,
    geojson: object,
    options?: google.maps.Data.GeoJsonOptions | undefined
  ): void {
    instance.addGeoJson(geojson, options)
  },
  contains(
    instance: google.maps.Data,
    feature: google.maps.Data.Feature
  ): void {
    instance.contains(feature)
  },
  foreach(
    instance: google.maps.Data,
    callback: (feature: google.maps.Data.Feature) => void
  ): void {
    instance.forEach(callback)
  },
  loadgeojson(
    instance: google.maps.Data,
    url: string,
    options: google.maps.Data.GeoJsonOptions,
    callback: (features: google.maps.Data.Feature[]) => void
  ): void {
    instance.loadGeoJson(url, options, callback)
  },
  overridestyle(
    instance: google.maps.Data,
    feature: google.maps.Data.Feature,
    style: google.maps.Data.StyleOptions
  ): void {
    instance.overrideStyle(feature, style)
  },
  remove(instance: google.maps.Data, feature: google.maps.Data.Feature): void {
    instance.remove(feature)
  },
  revertstyle(
    instance: google.maps.Data,
    feature: google.maps.Data.Feature
  ): void {
    instance.revertStyle(feature)
  },
  controlposition(
    instance: google.maps.Data,
    controlPosition: google.maps.ControlPosition
  ): void {
    instance.setControlPosition(controlPosition)
  },
  controls(instance: google.maps.Data, controls: string[] | null): void {
    instance.setControls(controls)
  },
  drawingmode(instance: google.maps.Data, mode: string | null): void {
    instance.setDrawingMode(mode)
  },
  map(instance: google.maps.Data, map: google.maps.Map): void {
    instance.setMap(map)
  },
  style(
    instance: google.maps.Data,
    style: google.maps.Data.StylingFunction | google.maps.Data.StyleOptions
  ): void {
    instance.setStyle(style)
  },
  togeojson(
    instance: google.maps.Data,
    callback: (feature: object) => void
  ): void {
    instance.toGeoJson(callback)
  },
}

type DataState = {
  data: google.maps.Data | null
}

export type DataProps = {
  options?: google.maps.Data.DataOptions | undefined
  /**  This event is fired for a click on the geometry. */
  onClick?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /**  This event is fired for a double click on the geometry. */
  onDblClick?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /**  This event is fired for a mousedown on the geometry. */
  onMouseDown?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /** This event is fired when the DOM mousemove event is fired on the rectangle. */
  onMouseMove?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /**  This event is fired when the mouse leaves the area of the geometry. */
  onMouseOut?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /**  This event is fired when the mouse enters the area of the geometry. */
  onMouseOver?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /**  This event is fired for a mouseup on the geometry. */
  onMouseUp?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /**  This event is fired for a rightclick on the geometry. */
  onRightClick?: ((e: google.maps.Data.MouseEvent) => void) | undefined
  /**  This event is fired when a feature is added to the collection. */
  onAddFeature?: ((e: google.maps.Data.AddFeatureEvent) => void) | undefined
  /**  This event is fired when a feature is removed from the collection. */
  onRemoveFeature?:
    | ((e: google.maps.Data.RemoveFeatureEvent) => void)
    | undefined
  /**  This event is fired when a feature's property is removed. */
  onRemoveProperty?:
    | ((e: google.maps.Data.RemovePropertyEvent) => void)
    | undefined
  /**  This event is fired when a feature's geometry is set. */
  onSetGeometry?: ((e: google.maps.Data.SetGeometryEvent) => void) | undefined
  /**  This event is fired when a feature's property is set. */
  onSetProperty?: ((e: google.maps.Data.SetPropertyEvent) => void) | undefined
  /**  This callback is called when the data instance has loaded. It is called with the data instance. */
  onLoad?: ((data: google.maps.Data) => void) | undefined
  /**  This callback is called when the component unmounts. It is called with the data instance.  */
  onUnmount?: ((data: google.maps.Data) => void) | undefined
}

function DataFunctional({
  options,
  onClick,
  onDblClick,
  onMouseDown,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onRightClick,
  onAddFeature,
  onRemoveFeature,
  onRemoveProperty,
  onSetGeometry,
  onSetProperty,
  onLoad,
  onUnmount,
}: DataProps): null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const [instance, setInstance] = useState<google.maps.Data | null>(null)

  // Order does matter
  useEffect(() => {
    if (!instance) return;

    instance.setMap(map);
  }, [map])

  useEffect(() => {
    if (!instance || !onDblClick) return;

    const handler = google.maps.event.addListener(instance, 'dblclick', onDblClick);

    return () => {
      handler.remove();
    }
  }, [instance, onDblClick])

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
    if (!instance || !onAddFeature) return;

    const handler = google.maps.event.addListener(instance, 'addfeature', onAddFeature);

    return () => {
      handler.remove();
    }
  }, [instance, onAddFeature])

  useEffect(() => {
    if (!instance || !onRemoveFeature) return;

    const handler = google.maps.event.addListener(instance, 'removefeature', onRemoveFeature);

    return () => {
      handler.remove();
    }
  }, [instance, onRemoveFeature])

  useEffect(() => {
    if (!instance || !onRemoveProperty) return;

    const handler = google.maps.event.addListener(instance, 'removeproperty', onRemoveProperty);

    return () => {
      handler.remove();
    }
  }, [instance, onRemoveProperty])

  useEffect(() => {
    if (!instance || !onSetGeometry) return;

    const handler = google.maps.event.addListener(instance, 'setgeometry', onSetGeometry);

    return () => {
      handler.remove();
    }
  }, [instance, onSetGeometry])

  useEffect(() => {
    if (!instance || !onSetProperty) return;

    const handler = google.maps.event.addListener(instance, 'setproperty', onSetProperty);

    return () => {
      handler.remove();
    }
  }, [instance, onSetProperty])

  useEffect(() => {
    if (!map) return;

    const data = new google.maps.Data({
      ...options,
      map,
    })

    setInstance(data)

    if (onLoad) {
      onLoad(data)
    }

    return () => {
      if (instance) {
        if (onUnmount) {
          onUnmount(instance)
        }

        instance.setMap(null)
      }
    }
  }, [])

  return null
}

export const DataF = memo(DataFunctional)

export class Data extends PureComponent<DataProps, DataState> {
  static override contextType = MapContext

  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []

  override state: DataState = {
    data: null,
  }

  setDataCallback = (): void => {
    if (this.state.data !== null && this.props.onLoad) {
      this.props.onLoad(this.state.data)
    }
  }

  override componentDidMount(): void {
    if (this.context !== null) {
      const data = new google.maps.Data({
        ...this.props.options,
        map: this.context,
      })

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps: {},
        nextProps: this.props,
        instance: data,
      })

      this.setState(() => {
        return {
          data,
        }
      }, this.setDataCallback)
    }
  }

  override componentDidUpdate(prevProps: DataProps): void {
    if (this.state.data !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.data,
      })
    }
  }

  override componentWillUnmount(): void {
    if (this.state.data !== null) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.data)
      }

      unregisterEvents(this.registeredEvents)

      if (this.state.data) {
        this.state.data.setMap(null)
      }
    }
  }

  override render(): null {
    return null
  }
}

export default Data
