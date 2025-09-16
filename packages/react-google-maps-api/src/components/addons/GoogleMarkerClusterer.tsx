import { useEffect, memo, type ReactElement, useMemo } from 'react'
import {
  MarkerClusterer,
  type MarkerClustererOptions,
} from '@googlemaps/markerclusterer'

import { useGoogleMap } from '../../map-context.js'

export type MarkerClustererOptionsSubset = Omit<
  MarkerClustererOptions,
  'map' | 'markers'
>

export type GoogleMarkerClustererProps = {
  /** Render prop that exposes marker clusterer to children components
   *
   * The callback function should return a list of Marker components.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (markerClusterer: MarkerClusterer) => ReactElement<any, any>
  /** Subset of {@link MarkerClustererOptions} options
   *
   * ```
   * {
   *   algorithm?: Algorithm;
   *   renderer?: Renderer;
   *   onClusterClick?: onClusterClickHandler;
   * }
   * ```
   */
  options: MarkerClustererOptionsSubset
    /** This callback is called when the clusterer instance has loaded. It is called with the clusterer instance. */
  onLoad?: ((clusterer:MarkerClusterer) => void) | undefined
    /** This callback is called when the component unmounts. It is called with the clusterer instance. */
  onUnload?: ((clusterer:MarkerClusterer) => void) | undefined
}

/** Wrapper around [@googlemaps/markerclusterer](https://github.com/googlemaps/js-markerclusterer)
 *
 * Accepts {@link  MarkerClustererOptionsSubset} which is a subset of  {@link MarkerClustererOptions}
 */
function GoogleMarkerClusterer({
  children,
  options,
  onLoad,
  onUnload,
}: GoogleMarkerClustererProps) {
  const map = useGoogleMap();

  const instance = useMemo(() => {
    return new MarkerClusterer({...options, map});
  }, []);

  useEffect(() => {
    instance.setMap(map);

    return () => {
      instance.setMap(null);
    }
  }, [map])

  useEffect(() => {
    if (!onLoad) return;

    onLoad(instance);
  }, [instance, onLoad]);

  useEffect(() => {
    if (!onUnload) return;

    return () => {
      onUnload(instance);
    }
  }, [instance, onUnload]);

  const content = useMemo(() => {
    if (!map) return;
    if (typeof children !== 'function') return;

    return children(instance);
  }, [instance, children])

  return content;
}

export default memo(GoogleMarkerClusterer)
