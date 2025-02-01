"use client";

import { logout } from "@/actions/auth";
import { upgradeToEnterprisePlan } from "@/actions/payment";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'

export const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export const PremiumButton = () => {
  const router = useRouter();
  const handleUpgrade = async () => {

    console.log(Cookies.get('token'));
    
    // try {
    //   const response = await upgradeToEnterprisePlan();
    //   router.push(response.url);
    // } catch (error) {
    //   console.error("Error creating checkout session:", error);
    // }
  };

  return <button onClick={handleUpgrade}>Upgrade to premium</button>;
};