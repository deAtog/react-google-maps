import { memo, useContext, useEffect, useMemo } from "react"
import type { URL } from "url"
import { AdvancedMarkerContext } from "./AdvancedMarker"

export type PinProps = {
    background?: string | undefined,
    borderColor?: string | undefined,
    glyph?: string | URL | Element | undefined,
    glyphColor?: string | undefined,
    scale?:number | undefined,
    onLoad?: ((pin: google.maps.marker.PinElement) => void) | undefined,
    onUnmount?: ((pin: google.maps.marker.PinElement) => void) | undefined,
}

function PinFunctional({
    background,
    borderColor,
    glyph,
    glyphColor,
    scale,
    onLoad,
    onUnmount
}: PinProps): null {
    const markerContext = useContext<google.maps.marker.AdvancedMarkerElement | null>(AdvancedMarkerContext);

    const instance = useMemo(() => {
        const options: google.maps.marker.PinElementOptions = {
            background: background ?? null,
            borderColor: borderColor ?? null,
            glyph: glyph ?? null,
            glyphColor: glyphColor ?? null,
            scale: scale ?? null,
        }

        return new google.maps.marker.PinElement(options);
    }, [])

    useEffect(() => {
        if (typeof background === 'undefined') return;

        instance.background = background;
    }, [instance, background])

    useEffect(() => {
        if (typeof borderColor === 'undefined') return;

        instance.borderColor = borderColor;
    }, [instance, borderColor])

    useEffect(() => {
        if (typeof glyph === 'undefined') return;

        instance.glyph = glyph;
    }, [instance, glyph])

    useEffect(() => {
        if (typeof glyphColor === 'undefined') return;

        instance.glyphColor = glyphColor;
    }, [instance, glyphColor])

    useEffect(() => {
        if (typeof scale === 'undefined') return;

        instance.scale = scale;
    })

    useEffect(() => {
        if (!onLoad) return;

        onLoad(instance);
    }, [instance, onLoad])

    useEffect(() => {
        if (!markerContext) return;

        markerContext.content?.appendChild(instance.element);

        return () => {
            instance.element.remove();
        }
    }, [instance, markerContext])

    useEffect(() => {
        if (!onUnmount) return;

        return () => {
            onUnmount(instance);
        }
    }, [instance, onUnmount])

    return null;
}

export const PinF = memo(PinFunctional);