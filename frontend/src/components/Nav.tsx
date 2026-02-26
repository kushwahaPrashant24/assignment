"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/",            label: "All Accounts" },
    { href: "/accounts",    label: "Create Account" },
    { href: "/transactions", label: "Transactions" },
    { href: "/transfer",    label: "Transfer" },
];

export default function Nav() {
    const pathname = usePathname();
    return (
        <nav style={{
            display: "flex", gap: "0.6rem", flexWrap: "wrap",
            justifyContent: "center", marginBottom: "2rem",
        }}>
            {links.map(({ href, label }) => {
                const active = pathname === href;
                return (
                    <Link key={href} href={href} style={{
                        color: active ? "#a78bfa" : "#94a3b8",
                        textDecoration: "none",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        padding: "0.38rem 0.9rem",
                        borderRadius: "99px",
                        border: `1px solid ${active ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
                        background: active ? "rgba(167,139,250,0.12)" : "transparent",
                        transition: "all 0.2s",
                    }}>
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
