"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { GetSor7edButton } from "./buttons/GetSor7edButton";

interface SaveToPhoneButtonProps {
    title: string;
    summary?: string;
    keyword?: string;
    pageUrl?: string;
    size?: "sm" | "md" | "lg";
    label?: string;
    className?: string;
    mode?: "public" | "dashboard";
}

export default function SaveToPhoneButton({
    title,
    summary,
    keyword,
    pageUrl,
    size = "md",
    label = "GET IT SOR7ED",
    className = "",
    mode = "public",
}: SaveToPhoneButtonProps) {
    const [isAuth, setIsAuth] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        createClient().auth.getUser().then(({ data }) => setIsAuth(!!data.user));
    }, []);

    const getUrl = () => {
        const raw = pageUrl ?? (typeof window !== "undefined" ? window.location.href : "");
        return raw.startsWith("/") ? window.location.origin + raw : raw;
    };

    // Construct the wa.me command string based on pageUrl context
    const getCommand = () => {
        if (keyword) return keyword;
        
        const urlStr = getUrl();
        if (urlStr.includes('/tools/')) {
            const slug = urlStr.split('/').pop();
            return `RUN ${slug}`;
        }
        if (urlStr.includes('/intelligence/')) {
            const slug = urlStr.split('/').pop();
            return `ARTICLE ${slug}`;
        }
        return `SAVE ${urlStr}`;
    };

    if (!isMounted) return null;

    if (!isAuth || mode === "public") {
        return (
            <GetSor7edButton 
                command={getCommand()} 
                label={label} 
                size={size} 
                variant="outline"
                className={className}
            />
        );
    }

    // Dashboard mode for authenticated users (saves to backend silently)
    const handleSaveToVault = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (status === "loading") return;
        setStatus("loading");

        try {
            const res = await fetch("/api/save-to-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, summary, pageUrl: getUrl() }),
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3500);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3500);
            }
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3500);
        }
    };

    const sizeClasses = {
        sm: "px-3 py-2 text-[9px] gap-1.5",
        md: "px-5 py-3 text-[10px] gap-2",
        lg: "px-7 py-4 text-xs gap-2.5",
    };

    const stateStyles = {
        idle:    "btn-outline cursor-pointer",
        loading: "bg-black/10 text-black/30 border-black/20 cursor-wait",
        success: "bg-black text-ps-yellow border-black",
        error:   "bg-white text-black border-black",
    };

    return (
        <button
            onClick={handleSaveToVault}
            disabled={status === "loading"}
            className={`inline-flex items-center justify-center font-sans font-bold uppercase tracking-[0.1em] rounded-full transition-all duration-100 shrink-0 ${sizeClasses[size]} ${stateStyles[status]} ${className}`}
        >
            {status === "idle" ? label : status === "loading" ? "Saving…" : status === "success" ? "Saved ✓" : "Error"}
        </button>
    );
}
