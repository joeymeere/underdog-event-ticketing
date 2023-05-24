import React from "react";
import EventCard from "./Card";
import { EventProps } from "../../interfaces";

const EventCardSection = ({ events }: any) => {
    return (
        <div className="max-w-7/12 p-24 grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
            {events.map((event: EventProps, i: number) => (
                <EventCard
                    key={i}
                    id={event.id}
                    name={event.data.name}
                    time={event.data.startTime}
                    city={event.data.location.city}
                    description={event.data.description}
                    image={event.data.image}
                    isRemote={event.data.location.isRemote}
                />
            ))}
        </div>
    )
}

export default EventCardSection;