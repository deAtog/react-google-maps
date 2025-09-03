import React, { useContext, type JSX, useMemo, type ReactNode, useEffect, Children, memo } from 'react';
import { createPortal } from 'react-dom';
import MapContext from '../../map-context';

export type AdvancedMarkerProps = {
    children?: ReactNode | undefined,
    /** Specifies how and advanced marker should behave when it collides with another advanced marker or with the basemap labels on a vector map. */
    collisionBehavior?: google.maps.CollisionBehavior | undefined,
    /** If true, the advanced marker will be clickable and trigger the onGmpClick event, and will be interactive for accessibility purposes (e.g. allowing keyboard navigation via arrow keys).
     * Default: false
    */
    clickable?: boolean | undefined,
    /** If true, the advanced marker can be dragged. Note: Advanced markers with altitude are not draggable.
     * Default: false
     */
    draggable?: boolean | undefined,
    //content: children?
    /** The position of the advanced marker. An advanced marker may be constructed without a position but will not be displayed until its position is provided. */
    position?: google.maps.LatLng | google.maps.LatLngLiteral | google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral,
    /** Rollover text. If provided, an accessibility text (e.g. for use with screen readers) will be added to the advanced marker with the provided value. */
    title?: string | undefined,
    /** All advanced markers are displayed on the map in order of their zIndex, with higher values displaying in front of advanced markers with lower values. By default, advanced markers are displayed according to their vertical position on the screen, with lower advanced markers appearing in front of advanced markers farther up the screen. Note that zIndex is also used to help determine relative priority between CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY advanced markers. A higher zIndex value indicates higher priority. */
    zIndex?: number | undefined,
    /** This event is fired when the advanced marker element is clicked and clickable is true. */
    onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined,
    /** This event is fires when the advanced marker element is right clicked and clickable is true. */
    onRightClick?: ((e: PointerEvent) => void) | undefined,
    /** This event is repeatedly fired while the user drags the advanced marker and draggable is true. */
    onDrag?: ((e: google.maps.MapMouseEvent) => void) | undefined,
    /** This event is fired when the user stops dragging the advanced marker. */
    onDragEnd?: ((e: google.maps.MapMouseEvent) => void) | undefined,
    /** This event is fired when the user starts dragging the advanced marker. */
    onDragStart?: ((e: google.maps.MapMouseEvent) => void) | undefined,
    /** This callback is called when the marker instance has loaded. It is called with the advanced marker instance. */
    onLoad?: ((marker: google.maps.marker.AdvancedMarkerElement) => void) | undefined,
    /** This callback is called when the component unmounts. It is called with the advanced marker instance. */
    onUnmount?: ((marker: google.maps.marker.AdvancedMarkerElement) => void) | undefined,
}

export const AdvancedMarkerContext = React.createContext<google.maps.marker.AdvancedMarkerElement | null>(null);

function AdvancedMarkerFunctional({
    children,
    collisionBehavior,
    clickable,
    draggable,
    position,
    title,
    zIndex,
    onClick,
    onRightClick,
    onDrag,
    onDragEnd,
    onDragStart,
    onLoad,
    onUnmount,
}: AdvancedMarkerProps): JSX.Element | null {
    const map = useContext<google.maps.Map | null>(MapContext)
    const content = document.createDocumentFragment();

    const instance = useMemo(() => {
        const options: google.maps.marker.AdvancedMarkerElementOptions = {
            collisionBehavior: collisionBehavior ?? null,
            gmpClickable: clickable ?? null,
            gmpDraggable: draggable ?? null,
            position: position ?? null,
            title: title ?? null,
            zIndex: zIndex ?? null,
            map: map,
            content,
        }

        return new google.maps.marker.AdvancedMarkerElement(options)
    }, [])

    useEffect(() => {
        if (typeof collisionBehavior === 'undefined') return;

        instance.collisionBehavior = collisionBehavior;
    }, [instance, collisionBehavior])

    useEffect(() => {
        if (typeof clickable === 'undefined') return;

        instance.gmpClickable = clickable;
    }, [instance, clickable])

    useEffect(() => {
        if (typeof draggable === 'undefined') return;

        instance.gmpDraggable = draggable;
    }, [instance, draggable])

    useEffect(() => {
        if (typeof position === 'undefined') return;

        instance.position = position;
    }, [instance, position])

    useEffect(() => {
        if (typeof title === 'undefined') return;

        instance.title = title;
    }, [instance, title])

    useEffect(() => {
        if (typeof zIndex === 'undefined') return;

        instance.zIndex = zIndex;
    }, [instance, zIndex])

    useEffect(() => {
        if (!onClick) return;

        const handler = instance.addListener('click', onClick);

        return () => {
            handler.remove();
        }
    }, [instance, onClick])

    useEffect(() => {
        if (!onRightClick) return;

        instance.addEventListener('contextmenu', onRightClick);

        return () => {
            instance.removeEventListener('contextmenu', onRightClick);
        }
    }, [instance, onRightClick])

    useEffect(() => {
        if (!onDrag) return;

        const handler = instance.addListener('drag', onDrag);

        return () => {
            handler.remove();
        }
    }, [instance, onDrag])

    useEffect(() => {
        if (!onDragEnd) return;

        const handler = instance.addListener('dragend', onDragEnd);

        return () => {
            handler.remove();
        }
    }, [instance, onDragEnd])

    useEffect(() => {
        if (!onDragStart) return;

        const handler = instance.addListener('dragstart', onDragStart);

        return () => {
            handler.remove();
        }
    }, [instance, onDragStart])

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

    useEffect(() => {
        if (typeof map === 'undefined') return;

        instance.map = map;
    }, [instance, map])

    return (
        <AdvancedMarkerContext.Provider value={instance}>
            {createPortal(Children.only(children), content)}
        </AdvancedMarkerContext.Provider>
    );
}

export const AdvancedMarkerF = memo(AdvancedMarkerFunctional);