'use client'

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { errorToast, successToast } from "@/helpers/toasts";

const Verify = () => {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    
    const verifyUser = async () => {
        if (!token) return;

        axios.put(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/authenticate`, { token }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(() => {
            setLoading(false);
            successToast('Successfully authenticated');
            setTimeout(() => {
                router.push('/dashboard');
            }, 500); // Small delay for hydration
            }).catch(err => {
            setLoading(false);
            errorToast("Error: " + (err.response.data.error || "Something went wrong"));
        });
    };
    
    useEffect(() => {
        verifyUser();
    }, [token]); //eslint-disable-line

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center text-2xl">Loading...</div>;
    }

    return <div className="min-h-screen flex justify-center items-center text-2xl">Verification completed. Redirecting to the Dashboard.</div>;
};

// Wrapping the component in Suspense
const VerifyWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Verify />
  </Suspense>
);

export default VerifyWithSuspense;