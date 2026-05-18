"use client";

import { useState } from "react";

interface Props {
    title: string;
    summary?: string;
    pageUrl?: string;
    size?: "sm" | "md" | "lg";
    label?: string;
    className?: string;
}

export default function SaveToPhoneButton({
    title,
    summary,
    pageUrl,
    size = "md",
    label = "GET IT SOR7ED",
    className = "",
}: Props) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (status === "loading") return;

        const url = pageUrl ?? window.location.href;
        setStatus("loading");

        try {
            const res = await fetch("/api/save-to-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, summary, pageUrl: url }),
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3500);
            } else if (res.status === 401 || res.status === 400 || res.status === 403) {
                // Not authenticated or no WhatsApp number — fall back to wa.me rich link
                setStatus("idle");
                window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3500);
            }
        } catch {
            // Network error — fall back to wa.me
            setStatus("idle");
            window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
        }
    };

    const sizeClasses = {
        sm:  "px-3 py-2 text-[9px] gap-1.5",
        md:  "px-5 py-3 text-[10px] gap-2",
        lg:  "px-7 py-4 text-xs gap-2.5",
    };

    const stateStyles = {
        idle:    "bg-ps-yellow text-black border-black hover:bg-black hover:text-ps-yellow",
        loading: "bg-black/10 text-black/30 border-black/20 cursor-wait",
        success: "bg-black text-ps-yellow border-black",
        error:   "bg-white text-black border-black",
    };

    const stateLabels = {
        idle:    label,
        loading: "Saving…",
        success: "Saved ✓",
        error:   "Try again",
    };

    return (
        <button
            onClick={handleSave}
            disabled={status === "loading"}
            title="Save to your WhatsApp"
            className={`
                inline-flex items-center justify-center font-display uppercase tracking-[0.15em]
                border-2 transition-all duration-100 active:scale-[0.97] shrink-0
                ${sizeClasses[size]}
                ${stateStyles[status]}
                ${className}
            `}
        >
            {status === "idle" && (
                <svg width={size === "sm" ? 11 : 13} height={size === "sm" ? 11 : 13} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
            )}
            {status === "loading" && (
                <svg width={size === "sm" ? 11 : 13} height={size === "sm" ? 11 : 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
            )}
            {stateLabels[status]}
        </button>
    );
}
