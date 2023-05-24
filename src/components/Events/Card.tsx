import { IconCalendar, IconLocation, IconUsers } from "@tabler/icons-react";
import moment from "moment";
import React from "react";

interface EventCardProps {
    id: string,
    name: string,
    time: number,
    city: string,
    description: string,
    image: string,
    isRemote: boolean,
}

const EventCard = ({ id, name, time, city, description, image, isRemote }: EventCardProps) => {
    return (
        <a href={`/event/${id}`}>
            <div
                className="-z-20 block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div
                    className="relative -z-20 overflow-hidden bg-cover bg-no-repeat"
                    data-te-ripple-init
                    data-te-ripple-color="light">
                    <img
                        className="rounded-t-lg h-5/10 -z-20"
                        src={image}
                        alt="" />

                    <div
                        className="absolute bottom-0 left-0 right-0 top-0 -z-20 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                </div>
                <div className="p-6">
                    <h5
                        className="text-2xl font-extrabold leading-tight text-neutral-800 dark:text-neutral-50">
                        {name}
                    </h5>
                    <div className="my-4">
                        <p className="text-lg font-semibold text-slate-300">
                            {description.slice(0, 50) + "..."}
                        </p>
                    </div>
                    <div className="w-full mb-4 grid grid-rows-2 gap-x-4 gap-y-4">
                        <div className="flex">
                            <IconLocation size={24} color="white" />
                            {isRemote ? (
                                <p className="ml-2 text-lg font-bold text-slate-200">Remote</p>
                            ) : (
                                <p className="ml-2 text-lg font-bold text-slate-200">{city}</p>
                            )}
                        </div>
                        <div className="flex">
                            <IconCalendar size={24} color="white" />
                            <p className="ml-2 text-lg font-bold text-slate-200">{moment.unix(time).calendar()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default EventCard;