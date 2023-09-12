import createEvent from '@/lib/createEvent';
import toast from "react-hot-toast";
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { uploadFile } from '@/lib/uploadFile';
import { useFirebase } from '@/providers/FirebaseProvider';
import UserGateModal from './UserGateModal';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';

const CreateForm = () => {
    const router = useRouter();
    const [isRemote, setIsRemote] = useState(false);
    const [isTransferable, setIsTransferable] = useState(true);
    const [isPaywalled, setIsPaywalled] = useState(false);
    const [isCapped, setIsCapped] = useState(false);
    const [open, setOpen] = useState(false);
    const { userDoc } = useFirebase();
    const { publicKey } = useWallet();

    useEffect(() => {
        const checkForUser = () => {
            if (userDoc == null) {
                setOpen(true);
            }
        }
        checkForUser();
    }, [userDoc])

    const validationSchema = Yup.object({
        name: Yup.string().max(32).required("Please select a name"),
        description: Yup.string().required(),
        image: Yup.string().url().required(),
        isRemote: Yup.boolean(),
        startDate: Yup.string().required("Please add a start date."),
        startTime: Yup.string().required("Please add a start time."),
        country: Yup.string().when('isRemote', {
            is: false,
            then: (country) => country.required().min(3),
            otherwise: (country) => country.min(0),
        }),
        city: Yup.string().when('isRemote', {
            is: false,
            then: (city) => city.required().min(3),
            otherwise: (city) => city.min(0),
        }),
        street: Yup.string().when('isRemote', {
            is: false,
            then: (street) => street.required().min(3),
            otherwise: (street) => street.min(0),
        }),
        state: Yup.string(),
        zip: Yup.string(),
        isTransferable: Yup.boolean(),
        isCapped: Yup.boolean(),
        isPaywalled: Yup.boolean(),
        ticketPrice: Yup.number().min(1).when('isPaywalled', {
            is: true,
            then: (ticketPrice) => ticketPrice.required().min(1),
            otherwise: (ticketPrice) => ticketPrice.min(0),
        }),
        totalTickets: Yup.number().when('isCapped', {
            is: true,
            then: (totalTickets) => totalTickets.required().min(10),
            otherwise: (totalTickets) => totalTickets.min(0),
        }),
    });

    const initialValues = {
        name: "",
        description: "",
        image: "",
        isRemote: false,
        country: "United States",
        city: "",
        state: "",
        street: "",
        zip: "",
        startTime: "",
        startDate: "",
        isTransferable: false,
        isPaywalled: false,
        isCapped: false,
        totalTickets: 10,
        ticketPrice: 1,
        currency: "USDC"
    };

    const handleSubmit = async (values: any) => {
        try {
            let unixTimestamp = Date.parse(`${values.startDate} ${values.startTime}`) / 1000;

            const formData: any = {
                name: values.name,
                description: values.description,
                image: values.image,
                location: {
                    isRemote: values.isRemote,
                    country: values.country,
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    zip: values.zip,
                },
                startTime: unixTimestamp,
                isTransferable: values.isTransferable,
                isPaywalled: values.isPaywalled,
                isCapped: values.isCapped,
                ticketPrice: values.ticketPrice,
                totalTickets: values.totalTickets,
                creatorId: userDoc?.id,
                publicKey: publicKey?.toString(),
                currency: values.currency
            };

            await toast.promise(createEvent(formData), {
                loading: "Submitting...",
                success: "Success!",
                error: "Error!",
            });

            router.push("/events");
        } catch (err) {
            alert(err)
        }
    };

    const renderError = (message: any) => <p className="text-red-500">{message}</p>;

    return (
        <>
            {open ? (
                <UserGateModal open={open} setOpen={setOpen} />
            ) : null}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    //@ts-ignore
                    event.preventDefault();
                    await handleSubmit(values);
                    resetForm();
                }}
            >
                {(formikProps) => (
                    <Form>
                        <div className="mr-auto ml-auto space-y-12 -z-10 w-9/12">
                            <div className="border-b border-slate-100/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-slate-100">Profile</h2>
                                <p className="mt-1 text-sm leading-6 text-slate-300">This information will be displayed publicly so be careful what you share.</p>

                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-slate-100">Event Title</label>
                                        <div className="mt-2">
                                            <Field type="text" name="name" id="name" placeholder="Enter the name of your event..." minLength={1} maxLength={50} onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("name", e.target.value)} autoComplete="given-name" required className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:ml-2 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 error:ring-red-300" />
                                        </div>
                                        <ErrorMessage name="name" render={renderError} />
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-slate-100">Description</label>
                                        <div className="mt-2">
                                            <Field as="textarea" id="description" name="description" placeholder="Enter an event description..." rows={3} minLength={5} maxLength={500} onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("description", e.target.value)} required className="block w-full rounded-md border-0 py-1.5 px-2 text-slate-100 shadow-sm bg-zinc-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"></Field>
                                        </div>
                                        <ErrorMessage name="description" render={renderError} />
                                        <p className="mt-3 text-sm leading-6 text-slate-200">Write a few sentences about your event.</p>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-slate-100">Event Start Date</label>
                                        <div className="mt-2">
                                            <Field type="date" id="startDate" name="startDate" placeholder="Enter a start date..." rows={3} minLength={5} maxLength={500} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                formikProps.setFieldValue("startDate", e.target.value)
                                            }}
                                                required className="block w-full rounded-md border-0 py-1.5 px-2 text-slate-100 shadow-sm bg-zinc-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"></Field>
                                        </div>
                                        <ErrorMessage name="startDate" render={renderError} />
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-slate-100">Event Time</label>
                                        <div className="mt-2">
                                            <Field type="time" id="startTime" name="startTime" placeholder="Enter a start time..." rows={3} minLength={5} maxLength={500} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                formikProps.setFieldValue("startTime", e.target.value)
                                            }}
                                                required className="block w-full rounded-md border-0 py-1.5 px-2 text-slate-100 shadow-sm bg-zinc-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"></Field>
                                        </div>
                                        <ErrorMessage name="startTime" render={renderError} />
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-slate-100">Cover Photo</label>
                                        <div className="mt-2 flex justify-center bg-zinc-700 rounded-lg border border-dashed border-slate-100/25 px-6 py-10">
                                            {formikProps.values.image.length > 0 ? (
                                                <div>
                                                    <img src={formikProps.values.image} alt="Event Image" />
                                                    <button onClick={() => formikProps.setFieldValue("image", "")} className="mt-4 w-full text-md font-semibold leading-6 text-slate-100">Clear</button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="-z-20 mt-4 flex text-sm leading-6 text-gray-600">
                                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                            <p className="text-slate-200">Upload a file</p>
                                                            <Field id="file-upload" name="file-upload" type="file" accept="image/png, image/jpeg" onChange={(e: ChangeEvent<HTMLInputElement>) => uploadFile(e.target.files).then((url) => formikProps.setFieldValue("image", url))} className="sr-only" />
                                                        </label>
                                                        <p className="pl-1 text-slate-200">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-slate-200">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                        <ErrorMessage name="image" render={renderError} />
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-slate-100/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-slate-100">Location Information</h2>
                                <p className="mt-1 text-sm leading-6 text-slate-200">Add an address where the event will be located.</p>

                                <div className="my-6 text-sm leading-6">
                                    <input id="remote" name="remote" type="checkbox" onChange={() => {
                                        if (isRemote == false) {
                                            setIsRemote(true)
                                            formikProps.setFieldValue("isRemote", true)
                                        } else {
                                            setIsRemote(false)
                                            formikProps.setFieldValue("isRemote", false)
                                        }
                                    }} className="h-4 w-4 mr-4 rounded border-gray-300 text-emerald-600 bg-emerald-500 checked:bg-emerald-500 focus:ring-emerald-600" />
                                    <label htmlFor="remote" className="font-medium text-slate-100">This event is remote</label>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-slate-100">Country</label>
                                    <div className="mt-2">
                                        <Field as="select" id="country" name="country" autoComplete="country-name" onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("country", e.target.value)} disabled={isRemote} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                            <option>Mexico</option>
                                            <option>India</option>
                                            <option>Germany</option>
                                        </Field>
                                    </div>
                                    <ErrorMessage name="country" render={renderError} />
                                </div>

                                <div className="mt-4 col-span-full">
                                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-slate-100">Street address</label>
                                    <div className="mt-2">
                                        <Field type="text" name="street" id="street" autoComplete="street-address" placeholder="Enter a street address..." onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("street", e.target.value)} disabled={isRemote} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 disabled:ring-gray-400 sm:text-sm sm:leading-6" />
                                    </div>
                                    <ErrorMessage name="street" render={renderError} />
                                </div>

                                <div className="mt-4 sm:col-span-2 sm:col-start-1">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-slate-100">City</label>
                                    <div className="mt-2">
                                        <Field type="text" name="city" id="city" autoComplete="address-level2" placeholder="Enter a city..." onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("city", e.target.value)} disabled={isRemote} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 disabled:ring-gray-400 sm:text-sm sm:leading-6" />
                                    </div>
                                    <ErrorMessage name="city" render={renderError} />
                                </div>

                                <div className="mt-4 sm:col-span-2">
                                    <label htmlFor="region" className="block text-sm font-medium leading-6 text-slate-100">State / Province</label>
                                    <div className="mt-2">
                                        <Field type="text" name="state" id="state" autoComplete="address-level1" placeholder="Enter a state/province..." onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("state", e.target.value)} disabled={isRemote} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 disabled:ring-gray-400 sm:text-sm sm:leading-6" />
                                    </div>
                                    <ErrorMessage name="state" render={renderError} />
                                </div>

                                <div className="mt-4 sm:col-span-2">
                                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-slate-100">ZIP / Postal code</label>
                                    <div className="mt-2">
                                        <Field type="text" name="zip" id="zip" autoComplete="zip" placeholder="Enter a ZIP/Postal Code..." onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("zip", e.target.value)} disabled={isRemote} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 disabled:ring-gray-400 sm:text-sm sm:leading-6" />
                                    </div>
                                    <ErrorMessage name="zip" render={renderError} />
                                </div>
                            </div>

                            <div className="border-b border-slate-100/10 pb-12">
                                <h2 className="mt-10 text-base font-semibold leading-7 text-slate-100">Ticket Pricing</h2>
                                <p className="mt-1 mb-6 text-sm leading-6 text-slate-200">Specifying ticket pricing configuration for your event.</p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-x-3">
                                        <input id="paywall" name="paywall" type="checkbox" checked={isPaywalled} onChange={() => {
                                            if (isPaywalled == true) {
                                                setIsPaywalled(false)
                                                formikProps.setFieldValue("isPaywalled", false)
                                            } else {
                                                setIsPaywalled(true)
                                                formikProps.setFieldValue("isPaywalled", true)
                                            }
                                        }} className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                                        <label htmlFor="paywall" className="block text-sm font-medium leading-6 text-slate-100">Charge for Tickets?</label>
                                    </div>
                                    {isPaywalled ? (
                                        <div className="sm:col-span-4">
                                            <label htmlFor="ticket-price" className="block text-sm font-medium leading-6 text-slate-100">Ticket Price</label>
                                            <div className="mt-2 flex">
                                                <input type="number" name="ticket-price" id="ticket-price" placeholder="Enter your ticket price..." onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("ticketPrice", e.target.value)} autoComplete="given-name" required className="block w-1/12 rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:ml-2 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6" />
                                                <button id="dropdownDelayButton" data-dropdown-toggle="dropdownDelay" data-dropdown-delay="500" data-dropdown-trigger="hover" className="ml-2 text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800" type="button">Select Currency <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
                                                <div id="dropdownDelay" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
                                                        <li>
                                                            <a onClick={() => formikProps.setFieldValue("currency", "USDC")} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">USDC</a>
                                                        </li>
                                                        <li>
                                                            <a onClick={() => formikProps.setFieldValue("currency", "BONK")} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">BONK</a>
                                                        </li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <h2 className="mt-10 text-base font-semibold leading-7 text-slate-100">Maximum Tickets</h2>
                                <p className="mt-1 mb-6 text-sm leading-6 text-slate-200">Specifying ticket pricing configuration for your event.</p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-x-3">
                                        <input id="paywall" name="paywall" type="checkbox" checked={isCapped} onChange={() => {
                                            if (isCapped == true) {
                                                setIsCapped(false)
                                                formikProps.setFieldValue("isCapped", false)
                                            } else {
                                                setIsCapped(true)
                                                formikProps.setFieldValue("isCapped", true)
                                            }
                                        }} className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600" />
                                        <label htmlFor="paywall" className="block text-sm font-medium leading-6 text-slate-100">Set a maximum for tickets?</label>
                                    </div>
                                    {isCapped ? (
                                        <div className="sm:col-span-4">
                                            <label htmlFor="ticket-price" className="block text-sm font-medium leading-6 text-slate-100">Max Tickets</label>
                                            <div className="mt-2">
                                                <input type="number" name="total-tickets" id="total-tickets" placeholder="Enter total tickets..." onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("totalTickets", e.target.value)} autoComplete="given-name" required className="block w-1/12 rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:ml-2 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6" />
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 mb-24 flex items-center justify-center gap-x-6">
                            <button type="submit" className="rounded-md bg-emerald-400 px-5 py-3 text-md font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Submit</button>
                            <button type="button" className="text-md font-semibold leading-6 text-slate-100">Cancel</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default CreateForm;