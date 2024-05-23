import { create } from "zustand";

export const useGlobalStore = create((set) => ({
    /*
    isAdmin: false,
    loginAdmin: (token) => {
        set({ isAdmin: true });
        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", "true");
        console.log("Admin Logged In.");
    },
    logoutAdmin: () => {
        set({ isAdmin: false });
        localStorage.removeItem("token");
        .removeItem("isAdmin");
    },
    */
}));
