import React, { useEffect, useState } from "react"
import { StyledText } from "./styles"
import { TLoadingProps } from "./types"

export const Loading = ({ text }: TLoadingProps) => {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots < 3 ? prevDots + 1 : 0));
        }, 500);

        return () => clearInterval(interval);
    }, []); // Only run this effect once

    return (
        <StyledText>{text} {'. '.repeat(dots)}</StyledText>
    )
}