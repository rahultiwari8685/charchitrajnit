import { Suspense } from "react";
import Marquee from "./Marquee";

interface MarqueeServerProps {
    children: React.ReactNode;
    speed?: number;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
}

export default function MarqueeServer(props: MarqueeServerProps) {
    return (
        <Suspense
            fallback={
                <div className={`marquee ${props.className || ""}`}>
                    <div className="marquee-content">{props.children}</div>
                </div>
            }
        >
            <Marquee {...props} />
        </Suspense>
    );
}
