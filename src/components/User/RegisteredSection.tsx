import React from "react";
import TicketCard from "./TicketCard";

const RegisteredSection = ({ registeredItems }: any) => {
    return (
        <div className="max-w-9/12 grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
            {registeredItems.map((ticket: any, i: number) => (
                <TicketCard
                    key={i}
                    name={ticket.data.eventName}
                    image={ticket.data.image}
                    eventId={ticket.id}
                    time={ticket.data.startTime}
                />
            ))}
        </div>
    )
}

export default RegisteredSection;