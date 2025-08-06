/* global google */
import {
  memo,
  useRef,
  Children,
  useEffect,
  useContext,
  useMemo,
  PureComponent,
  type ReactNode,
  type ReactPortal,
  type ContextType,
} from 'react'
import { createPortal } from 'react-dom'
import invariant from 'invariant'
import {
  InfoBox as GoogleMapsInfoBox,
  type InfoBoxOptions,
} from '@deatog/react-google-maps-infobox'

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
  options(instance: GoogleMapsInfoBox, options: InfoBoxOptions): void {
    instance.setOptions(options)
  },
  position(
    instance: GoogleMapsInfoBox,
    position: google.maps.LatLng | google.maps.LatLngLiteral
  ): void {
    if (position instanceof google.maps.LatLng) {
      instance.setPosition(position)
    } else {
      instance.setPosition(new google.maps.LatLng(position.lat, position.lng))
    }
  },
  visible(instance: GoogleMapsInfoBox, visible: boolean): void {
    instance.setVisible(visible)
  },
  zIndex(instance: GoogleMapsInfoBox, zIndex: number): void {
    instance.setZIndex(zIndex)
  },
}

type InfoBoxState = {
  infoBox: GoogleMapsInfoBox | null
}

export type InfoBoxProps = {
  children?: ReactNode | undefined
  /** Can be any MVCObject that exposes a LatLng position property and optionally a Point anchorPoint property for calculating the pixelOffset. The anchorPoint is the offset from the anchor's position to the tip of the InfoBox. */
  anchor?: google.maps.MVCObject | undefined
  options?: InfoBoxOptions | undefined
  /** The LatLng at which to display this InfoBox. If the InfoBox is opened with an anchor, the anchor's position will be used instead. */
  position?: google.maps.LatLng | undefined
  /** All InfoBoxes are displayed on the map in order of their zIndex, with higher values displaying in front of InfoBoxes with lower values. By default, InfoBoxes are displayed according to their latitude, with InfoBoxes of lower latitudes appearing in front of InfoBoxes at higher latitudes. InfoBoxes are always displayed in front of markers. */
  zIndex?: number | undefined
  /** This event is fired when the close button was clicked. */
  onCloseClick?: (() => void) | undefined
  /** This event is fired when the <div> containing the InfoBox's content is attached to the DOM. You may wish to monitor this event if you are building out your info window content dynamically. */
  onDomReady?: (() => void) | undefined
  /** This event is fired when the content property changes. */
  onContentChanged?: (() => void) | undefined
  /** This event is fired when the position property changes. */
  onPositionChanged?: (() => void) | undefined
  /** This event is fired when the InfoBox's zIndex changes. */
  onZindexChanged?: (() => void) | undefined
  /** This callback is called when the infoBox instance has loaded. It is called with the infoBox instance. */
  onLoad?: ((infoBox: GoogleMapsInfoBox) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the infoBox instance. */
  onUnmount?: ((infoBox: GoogleMapsInfoBox) => void) | undefined
}

const defaultOptions: InfoBoxOptions = {}

function InfoBoxFunctional({
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
}: InfoBoxProps): ReactPortal | null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const containerElementRef = useRef<HTMLDivElement>(document.createElement('div'));

  const instance = useMemo(() => {
    const { position, ...infoBoxOptions }: InfoBoxOptions =
    options || defaultOptions

    let positionLatLng: google.maps.LatLng | undefined

    if (position && !(position instanceof google.maps.LatLng)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      positionLatLng = new google.maps.LatLng(position.lat, position.lng)
    }

    const infoBox = new GoogleMapsInfoBox({
      ...infoBoxOptions,
      ...(positionLatLng ? { position: positionLatLng } : {}),
    })

    infoBox.setContent(containerElementRef.current);

    return infoBox;
  }, [])

  // Order does matter
  useEffect(() => {
    if (!options) return;

    instance.setOptions(options)
  }, [instance, options])

  useEffect(() => {
    if (!position) return;

    const positionLatLng =
      position instanceof google.maps.LatLng
        ? position
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          new google.maps.LatLng(position.lat, position.lng)

    instance.setPosition(positionLatLng)
  }, [instance, position])

  useEffect(() => {
    if (typeof zIndex !== 'number') return;

    instance.setZIndex(zIndex)
  }, [instance, zIndex])

  useEffect(() => {
    if (!onCloseClick) return;

    const handler = google.maps.event.addListener(instance, 'closeclick', onCloseClick);

    return () => {
      handler.remove();
    }
  }, [instance, onCloseClick])

  useEffect(() => {
    if (!onDomReady) return;

    const handler = google.maps.event.addListener(instance, 'domready', onDomReady);

    return () => {
      handler.remove();
    }
  }, [instance, onDomReady])

  useEffect(() => {
    if (!onContentChanged) return;

    const handler = google.maps.event.addListener(instance, 'content_changed',onContentChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onContentChanged])

  useEffect(() => {
    if (!onPositionChanged) return;

    const handler = google.maps.event.addListener(instance, 'position_changed', onPositionChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onPositionChanged])

  useEffect(() => {
    if (!onZindexChanged) return;

    const handler = google.maps.event.addListener(instance, 'zindex_changed', onZindexChanged);

    return () => {
      handler.remove();
    }
  }, [instance, onZindexChanged])

  useEffect(() => {
    if (!map) return;

    if (anchor) {
      instance.open(map, anchor)
    } else if (instance.getPosition()) {
      instance.open(map)
    } else {
      invariant(
        false,
        'You must provide either an anchor or a position prop for <InfoBox>.'
      )
    }

    return () => {
      instance.close();
    }
  }, [map, instance, anchor])

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

  return containerElementRef.current
    ? createPortal(Children.only(children), containerElementRef.current)
    : null
}

export const InfoBoxF = memo(InfoBoxFunctional)

export class InfoBoxComponent extends PureComponent<
  InfoBoxProps,
  InfoBoxState
> {
  static override contextType = MapContext

  declare context: ContextType<typeof MapContext>

  registeredEvents: google.maps.MapsEventListener[] = []
  containerElement: HTMLElement | null = null

  override state: InfoBoxState = {
    infoBox: null,
  }

  open = (infoBox: GoogleMapsInfoBox, anchor?: google.maps.MVCObject): void => {
    if (anchor) {
      if (this.context !== null) {
        infoBox.open(this.context, anchor)
      }
    } else if (infoBox.getPosition()) {
      if (this.context !== null) {
        infoBox.open(this.context)
      }
    } else {
      invariant(
        false,
        'You must provide either an anchor or a position prop for <InfoBox>.'
      )
    }
  }

  setInfoBoxCallback = (): void => {
    if (this.state.infoBox !== null && this.containerElement !== null) {
      this.state.infoBox.setContent(this.containerElement)

      this.open(this.state.infoBox, this.props.anchor)

      if (this.props.onLoad) {
        this.props.onLoad(this.state.infoBox)
      }
    }
  }

  override componentDidMount(): void {
    const { position, ...infoBoxOptions }: InfoBoxOptions =
      this.props.options || {}

    let positionLatLng: google.maps.LatLng | undefined

    if (position && !(position instanceof google.maps.LatLng)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      positionLatLng = new google.maps.LatLng(position.lat, position.lng)
    }

    const infoBox = new GoogleMapsInfoBox({
      ...infoBoxOptions,
      ...(positionLatLng ? { position: positionLatLng } : {}),
    })

    this.containerElement = document.createElement('div')

    this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
      updaterMap,
      eventMap,
      prevProps: {},
      nextProps: this.props,
      instance: infoBox,
    })

    this.setState({ infoBox }, this.setInfoBoxCallback)
  }

  override componentDidUpdate(prevProps: InfoBoxProps): void {
    const { infoBox } = this.state

    if (infoBox !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: infoBox,
      })
    }
  }

  override componentWillUnmount(): void {
    const { onUnmount } = this.props
    const { infoBox } = this.state

    if (infoBox !== null) {
      if (onUnmount) {
        onUnmount(infoBox)
      }

      unregisterEvents(this.registeredEvents)
      infoBox.close()
    }
  }

  override render(): ReactPortal | null {
    return this.containerElement
      ? createPortal(Children.only(this.props.children), this.containerElement)
      : null
  }
}

export default InfoBoxComponent
