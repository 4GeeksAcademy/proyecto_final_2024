import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Cloudinary from "../component/Cloudinary.jsx";


export const Profile = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getUserData();
    }, []);

    return (
        <div className="text-center mt-5 container">
            <h1>Profile</h1>
            {store.user ? (
                <>
                    <p><strong>Email:</strong> {store.user.email}</p>
                    <p><strong>Name:</strong> {store.user.name}</p>
                    <img src={store.user.profile_picture_url} className="rounded-circle" alt="Profile" />
                    <Cloudinary userId={store.user.id} />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};