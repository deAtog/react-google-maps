/* global google */
import {
  memo,
  useRef,
  Children,
  useEffect,
  useContext,
  PureComponent,
  type ReactNode,
  type ReactPortal,
  type ContextType,
  useMemo,
} from 'react'
import invariant from 'invariant'
import { createPortal } from 'react-dom'

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents,
} from '../../utils/helper.js'

import MapContext from '../../map-context.js'

const eventMap = {
  onCloseClick: 'closeclick',
  onContentChanged: 'content_changed',
  onDomReady: 'domready',
  onPositionChanged: 'position_changed',
  onZindexChanged: 'zindex_changed',
}

const updaterMap = {
  options(
    instance: google.maps.InfoWindow,
    options: google.maps.InfoWindowOptions
  ): void {
    instance.setOptions(options)
  },
  position(
    instance: google.maps.InfoWindow,
    position: google.maps.LatLng | google.maps.LatLngLiteral
  ): void {
    instance.setPosition(position)
  },
  zIndex(instance: google.maps.InfoWindow, zIndex: number): void {
    instance.setZIndex(zIndex)
  },
}

type InfoWindowState = {
  infoWindow: google.maps.InfoWindow | null
}

export type InfoWindowProps = {
  children?: ReactNode | undefined
  /** Can be any MVCObject that exposes a LatLng position property and optionally a Point anchorPoint property for calculating the pixelOffset. The anchorPoint is the offset from the anchor's position to the tip of the InfoWindow. */
  anchor?: google.maps.MVCObject | undefined
  options?: google.maps.InfoWindowOptions | undefined
  /** The LatLng at which to display this InfoWindow. If the InfoWindow is opened with an anchor, the anchor's position will be used instead. */
  position?: google.maps.LatLng | google.maps.LatLngLiteral | undefined
  /** All InfoWindows are displayed on the map in order of their zIndex, with higher values displaying in front of InfoWindows with lower values. By default, InfoWindows are displayed according to their latitude, with InfoWindows of lower latitudes appearing in front of InfoWindows at higher latitudes. InfoWindows are always displayed in front of markers. */
  zIndex?: number | undefined
  /** This event is fired when the close button was clicked. */
  onCloseClick?: (() => void) | undefined
  /** This event is fired when the <div> containing the InfoWindow's content is attached to the DOM. You may wish to monitor this event if you are building out your info window content dynamically. */
  onDomReady?: (() => void) | undefined
  /** This event is fired when the content property changes. */
  onContentChanged?: (() => void) | undefined
  /** This event is fired when the position property changes. */
  onPositionChanged?: (() => void) | undefined
  /** This event is fired when the InfoWindow's zIndex changes. */
  onZindexChanged?: (() => void) | undefined
  /** This callback is called when the infoWindow instance has loaded. It is called with the infoWindow instance. */
  onLoad?: ((infoWindow: google.maps.InfoWindow) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the infoWindow instance. */
  onUnmount?: ((infoWindow: google.maps.InfoWindow) => void) | undefined
}

function InfoWindowFunctional({
  children,
  anchor,
  options,
  position,
  zIndex,
  onCloseClick,
  onDomReady,
  onContentChanged,
  onPositionChanged,
  onZindexChanged,
  onLoad,
  onUnmount,
}: InfoWindowProps): ReactPortal | null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const containerElementRef = useRef<HTMLDivElement>(document.createElement('div'));

  const instance = useMemo(() => {
    const infoWindow = new google.maps.InfoWindow(options)

    infoWindow.setContent(containerElementRef.current)

    return infoWindow;
  }, []);

  // Order does matter
  useEffect(() => {
    if (!instance) return;

    if (anchor) {
      instance.open(map, anchor)
    } else if (instance.getPosition()) {
      instance.open(map)
    } else {
      invariant(
        false,
        `You must provide either an anchor (typically render it inside a <Marker>) or a position props for <InfoWindow>.`
      )
    }

    return () => {
      instance.close();
    }
  }, [map, instance, anchor])

  useEffect(() => {
    if (!instance || !options) return;

    instance.setOptions(options)
  }, [instance, options])

  useEffect(() => {
    if (!instance || !position) return;

    instance.setPosition(position)
  }, [instance, position])

  useEffect(() => {
    if (!instance || typeof zIndex !== 'number') return;

    instance.setZIndex(zIndex)
  }, [instance, zIndex])

  useEffect(() => {
    if (!instance || !onCloseClick) return;

    const handler = google.maps.event.addListener(instance, 'closeclick', onCloseClick);

    return () => {
      handler.remove();
    }
  }, [instance, onCloseClick])

  useEffect(() => {
    if (!instance || !onDomReady) return;

    const handler = google.maps.event.addListener(instance, 'domready', onDomReady);

    return () => {
      handler.remove();
    }
  }, [instance, onDomReady])

  useEffect(() => {
    if (!instance || !onContentChanged) return;

    const handler = google.maps.event.addListener(instance, 'content_changed', onContentChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onContentChanged])

  useEffect(() => {
    if (!instance || !onPositionChanged) return;

    const handler = google.maps.event.addListener(instance, 'position_changed', onPositionChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onPositionChanged])

  useEffect(() => {
    if (!instance || !onZindexChanged) return;

    const handler = google.maps.event.addListener(instance, 'zindex_changed', onZindexChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onZindexChanged])

  useEffect(() => {
    if (!instance || !onLoad) return;

    onLoad(instance);
  })

  useEffect(() => {
    if (!instance || !onUnmount) return;

    return () => {
      onUnmount(instance);
    }
  })

  return containerElementRef.current
    ? createPortal(Children.only(children), containerElementRef.current)
    : null
}

export const InfoWindowF = memo(InfoWindowFunctional)

export class InfoWindow extends PureComponent<
  InfoWindowProps,
  InfoWindowState
> {
  static override contextType = MapContext

  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []
  containerElement: HTMLElement | null = null

  override state: InfoWindowState = {
    infoWindow: null,
  }

  open = (
    infoWindow: google.maps.InfoWindow,
    anchor?: google.maps.MVCObject | undefined
  ): void => {
    if (anchor) {
      infoWindow.open(this.context, anchor)
    } else if (infoWindow.getPosition()) {
      infoWindow.open(this.context)
    } else {
      invariant(
        false,
        `You must provide either an anchor (typically render it inside a <Marker>) or a position props for <InfoWindow>.`
      )
    }
  }

  setInfoWindowCallback = (): void => {
    if (this.state.infoWindow !== null && this.containerElement !== null) {
      this.state.infoWindow.setContent(this.containerElement)

      this.open(this.state.infoWindow, this.props.anchor)

      if (this.props.onLoad) {
        this.props.onLoad(this.state.infoWindow)
      }
    }
  }

  override componentDidMount(): void {
    const infoWindow = new google.maps.InfoWindow(this.props.options)

    this.containerElement = document.createElement('div')

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: infoWindow,
    })

    this.setState(() => {
      return {
        infoWindow,
      }
    }, this.setInfoWindowCallback)
  }

  override componentDidUpdate(prevProps: InfoWindowProps): void {
    if (this.state.infoWindow !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.infoWindow,
      })
    }
  }

  override componentWillUnmount(): void {
    if (this.state.infoWindow !== null) {
      unregisterEvents(this.registeredEvents)

      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.infoWindow)
      }

      this.state.infoWindow.close()
    }
  }

  override render(): ReactPortal | null {
    return this.containerElement
      ? createPortal(Children.only(this.props.children), this.containerElement)
      : null
  }
}

export default InfoWindow
