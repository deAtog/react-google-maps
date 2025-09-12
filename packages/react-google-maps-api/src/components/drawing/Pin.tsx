import { memo, PureComponent, useContext, useEffect, useMemo, type ContextType, type ReactNode } from "react"
import type { URL } from "url"
import { AdvancedMarkerContext } from "./AdvancedMarker"
import { applyUpdaterToNextProps } from "../../utils/helper";

const updaterMap = {
    background(
        instance:google.maps.marker.PinElement,
        background:string | undefined | null
    ): void {
        instance.background = background ?? null;
    },
    borderColor(
        instance:google.maps.marker.PinElement,
        borderColor:string | undefined | null
    ): void {
        instance.borderColor = borderColor ?? null;
    },
    glyph(
        instance:google.maps.marker.PinElement,
        glyph:string|URL|Element | undefined | null
    ): void {
        instance.glyph = glyph ?? null;
    },
    glyphColor(
        instance:google.maps.marker.PinElement,
        glyphColor:string|undefined|null
    ): void {
        instance.glyphColor = glyphColor ?? null;
    },
    scale(
        instance:google.maps.marker.PinElement,
        scale:number|undefined|null
    ): void {
        instance.scale = scale ?? null;
    }
}

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

export class Pin extends PureComponent<PinProps> {
    static override contextType = AdvancedMarkerContext
    declare context: ContextType<typeof AdvancedMarkerContext>

    pin: google.maps.marker.PinElement | undefined;

    override componentDidMount(): void {
        const {
            background,
            borderColor,
            glyph,
            glyphColor,
            scale
        } = this.props;

        const options: google.maps.marker.PinElementOptions = {
            background: background ?? null,
            borderColor: borderColor ?? null,
            glyph: glyph ?? null,
            glyphColor: glyphColor ?? null,
            scale: scale ?? null,
        }

        this.pin = new google.maps.marker.PinElement(options);

        this.context?.content?.appendChild(this.pin.element);

        if (this.props.onLoad) {
            this.props.onLoad(this.pin);
        }
    }

    override componentDidUpdate(prevProps: Readonly<PinProps>): void {
        if (!this.pin) {
            return;
        }

        applyUpdaterToNextProps(updaterMap, prevProps, this.props, this.pin);
    }

    override componentWillUnmount(): void {
        if (!this.pin) {
            return;
        }

        if (this.props.onUnmount) {
            this.props.onUnmount(this.pin);
        }

        this.pin.element.remove();
    }

    override render(): ReactNode {
        return null;
    }
}

export default Pin;