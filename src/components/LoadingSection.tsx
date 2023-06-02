import React from "react";
import LoadingCard from "./LoadingCard";

const LoadingSection = () => {
    return (
        <div className="max-w-6/12 p-24 grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
        </div>
    )
}

export default LoadingSection;