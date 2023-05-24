import { IconCalendar } from "@tabler/icons-react";
import moment from "moment";
import React from "react";

interface TicketCardProps {
    name: string,
    image: string,
    eventId: string,
    time: number,
}

const TicketCard = ({ name, image, eventId, time }: TicketCardProps) => {
    return (
        <a href={`/event/${eventId}`}>
            <div
                className="-z-30 block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div
                    className="overflow-hidden bg-cover bg-no-repeat pb-2/6 -z-20"
                >
                    <img
                        className="object-cover rounded-t-lg h-5/10 -z-10"
                        src={image}
                        alt="" />

                </div>
                <div className="p-6">
                    <h5
                        className="text-2xl font-extrabold leading-tight text-neutral-800 dark:text-neutral-50">
                        {name}
                    </h5>
                </div>
                <div className="w-full mb-4 grid grid-rows-2 gap-x-4 gap-y-4">
                        <div className="flex">
                            <IconCalendar size={24} color="white" />
                            <p className="ml-2 text-lg font-bold text-slate-200">{moment.unix(time).calendar()}</p>
                        </div>
                    </div>
            </div>
        </a>
    )
}

export default TicketCard;