import { useWallet } from "@solana/wallet-adapter-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import React, { ChangeEvent, useEffect, useState } from "react"
import { toast } from "react-hot-toast";
import { createUser } from "@/lib/createUser";
import { uploadFile } from "@/lib/uploadFile";
import { useRouter } from "next/router";

const CreateUserForm = () => {
    const { connected, publicKey } = useWallet();
    const [pubkey, setPubkey] = useState<any>();
    const router = useRouter();

    const validationSchema = Yup.object({
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        email: Yup.string().email().required(),
        image: Yup.string().url().required(),
    });

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        image: "",
        walletAddress: "",
    };

    async function handleSubmit(values: any) {
        try {
            const formData: any = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                walletAddress: pubkey,
                image: values.image,
            };

            await alert(JSON.stringify(formData));

            await toast.promise(createUser(formData), {
                loading: "Submitting...",
                success: "Success!",
                error: "Error!",
            });
        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        const checkConnected = () => {
            if (connected) {
                setPubkey(publicKey?.toString());
            }
        }
        checkConnected();
    }, [connected])

    const renderError = (message: any) => <p className="text-red-500">{message}</p>;

    return (
        <div className="mr-auto ml-auto border-b border-slate-100/10 w-9/12 pb-12">
            <h2 className="text-base font-semibold leading-7 text-slate-100">General Information</h2>
            <p className="mt-1 text-sm leading-6 text-slate-200">Add some personal information about yourself.</p>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    //@ts-ignore
                    event.preventDefault();
                    await handleSubmit(values);
                    resetForm();
                    router.push("/events");
                }}
            >
                {(formikProps) => (
                    <Form>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-slate-100">First name</label>
                                <div className="mt-2">
                                    <Field type="text" name="firstName" id="firstName" autoComplete="given-name" onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("firstName", e.target.value)} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:ml-2 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 error:ring-red-300" />
                                </div>
                                <ErrorMessage name="firstName" render={renderError} />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-slate-100">Last name</label>
                                <div className="mt-2">
                                    <Field type="text" name="lastName" id="lastName" autoComplete="family-name" onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("lastName", e.target.value)} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:ml-2 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 error:ring-red-300" />
                                </div>
                                <ErrorMessage name="lastName" render={renderError} />
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-100">Email address</label>
                                <div className="mt-2">
                                    <Field id="email" name="email" type="email" autoComplete="email" onChange={(e: ChangeEvent<HTMLInputElement>) => formikProps.setFieldValue("email", e.target.value)} className="block w-full rounded-md border-0 bg-zinc-700 py-1.5 px-2 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:ml-2 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 error:ring-red-300" />
                                </div>
                                <ErrorMessage name="email" render={renderError} />
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-slate-100">Cover Photo</label>
                                <div className="mt-2 flex justify-center bg-zinc-700 rounded-lg border border-dashed border-slate-100/25 px-6 py-10">
                                    {formikProps.values.image.length > 0 ? (
                                        <div>
                                            <img src={formikProps.values.image} alt="User Image" />
                                            <button onClick={() => formikProps.setFieldValue("image", "")} className="mt bg-emerald-500">Clear</button>
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

                        <div className="mt-6 mb-24 flex items-center justify-center gap-x-6">
                            <button type="submit" disabled={!connected} className="rounded-md bg-emerald-400 px-5 py-3 text-md font-semibold text-white shadow-sm disabled:bg-zinc-700 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Submit</button>
                            <button type="button" className="text-md font-semibold leading-6 text-slate-100">Cancel</button>
                        </div>
                    </Form>
                )}
            </Formik>

        </div >
    )
}

export default CreateUserForm;