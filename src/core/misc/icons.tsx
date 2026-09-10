import React from "react";

export type IconProps = {
    render?: boolean;
    size?: number;
    color?: string;
};

// UI icons share one geometry - 24x24, 1.75 stroke, round caps and joins - so a toolbar of them
// reads as one set rather than a collection. Brand marks stay filled: a logo has to keep its own
// silhouette to stay recognisable.
function outline(props: IconProps, children: React.ReactNode) {
    if (props?.render === false) return null;
    const size = props?.size ?? 24;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={props?.color ?? "currentColor"}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {children}
        </svg>
    );
}

function solid(props: IconProps, children: React.ReactNode) {
    if (props?.render === false) return null;
    const size = props?.size ?? 24;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={props?.color ?? "currentColor"}
            aria-hidden="true"
            focusable="false"
        >
            {children}
        </svg>
    );
}

/* ---- Navigation ---- */

export function HomeIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M3.5 10.4 12 3.6l8.5 6.8" />
        <path d="M5.7 9.6V19a1.6 1.6 0 0 0 1.6 1.6h2.9v-5.4h3.6v5.4h2.9A1.6 1.6 0 0 0 18.3 19V9.6" />
    </>);
}

export function DocumentIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M13.5 3H7.4A1.9 1.9 0 0 0 5.5 4.9v14.2A1.9 1.9 0 0 0 7.4 21h9.2a1.9 1.9 0 0 0 1.9-1.9V7.8z" />
        <path d="M13.5 3v4.8h5" />
        <path d="M9 12.7h6M9 16.2h4.2" />
    </>);
}

export function FolderIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M3.5 6.6a1.6 1.6 0 0 1 1.6-1.6h3.6l2 2.4h7.7a1.6 1.6 0 0 1 1.6 1.6v8.4a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6z" />
    </>);
}

export function MenuIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M4 7h16M4 12h16M4 17h16" />
    </>);
}

export function MenuCollapseIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M4 7h16M4 17h16M4 12h9" />
        <path d="m20 9.5-2.5 2.5 2.5 2.5" />
    </>);
}

export function ChevronDownIcon(props?: IconProps) {
    return outline(props, <path d="m6 9.5 6 6 6-6" />);
}

export function ChevronUpIcon(props?: IconProps) {
    return outline(props, <path d="m6 14.5 6-6 6 6" />);
}

export function ChevronRightIcon(props?: IconProps) {
    return outline(props, <path d="m9.5 6 6 6-6 6" />);
}

export function ChevronLeftIcon(props?: IconProps) {
    return outline(props, <path d="m14.5 6-6 6 6 6" />);
}

export function ArrowLeftIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
    </>);
}

export function ArrowRightIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
    </>);
}

export function ListIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11" />
        <path d="M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" />
    </>);
}

/* ---- Theme ---- */

export function SunIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="4.1" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
    </>);
}

export function MoonIcon(props?: IconProps) {
    return outline(props, <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8" />);
}

/* ---- Actions ---- */

export function CheckIcon(props?: IconProps) {
    return outline(props, <path d="m5 12.8 4.4 4.4L19 7.6" />);
}

export function IndeterminateIcon(props?: IconProps) {
    return outline(props, <path d="M6.5 12h11" />);
}

export function CloseIcon(props?: IconProps) {
    return outline(props, <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" />);
}

export function CancelIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
    </>);
}

export function DeleteIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M4.5 6.6h15" />
        <path d="M9.4 6.6V4.9a1.4 1.4 0 0 1 1.4-1.4h2.4a1.4 1.4 0 0 1 1.4 1.4v1.7" />
        <path d="M6.6 6.6l.9 12.1a1.8 1.8 0 0 0 1.8 1.7h5.4a1.8 1.8 0 0 0 1.8-1.7l.9-12.1" />
        <path d="M10.5 10.4v6.2M13.5 10.4v6.2" />
    </>);
}

export function RefreshIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M20.2 11.2a8.3 8.3 0 1 0-.7 4.6" />
        <path d="M20.6 4.6v6.6H14" />
    </>);
}

export function ClipboardIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M9 4.7H7.4a1.9 1.9 0 0 0-1.9 1.9v12.5A1.9 1.9 0 0 0 7.4 21h9.2a1.9 1.9 0 0 0 1.9-1.9V6.6a1.9 1.9 0 0 0-1.9-1.9H15" />
        <rect x="9" y="2.9" width="6" height="3.6" rx="1.1" />
    </>);
}

export function LogoutIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M14.5 4.6h3.4A1.6 1.6 0 0 1 19.5 6.2v11.6a1.6 1.6 0 0 1-1.6 1.6h-3.4" />
        <path d="M10 15.6 13.6 12 10 8.4" />
        <path d="M13.6 12H4.5" />
    </>);
}

export function SettingsIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="2.9" />
        <path d="M19.1 14.6a1.5 1.5 0 0 0 .3 1.6l.1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.5 1.5 0 0 0-2.5 1v.2a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-2.6-1l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.5 1.5 0 0 0-1-2.5H4.5a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1-2.6l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.5 1.5 0 0 0 1.6.3h.1a1.5 1.5 0 0 0 .9-1.4V4.5a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 2.5 1l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.5 1.5 0 0 0 1 2.5h.2a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9z" />
    </>);
}

/* ---- Status ---- */

export function InfoIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M12 11.2v5M12 7.9h.01" />
    </>);
}

export function InfoCircleIcon(props?: IconProps) {
    return InfoIcon(props);
}

export function SuccessCircleIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="m8.2 12.2 2.6 2.6 5-5.4" />
    </>);
}

export function WarningIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M10.6 4.3 2.9 17.6a1.6 1.6 0 0 0 1.4 2.4h15.4a1.6 1.6 0 0 0 1.4-2.4L13.4 4.3a1.6 1.6 0 0 0-2.8 0z" />
        <path d="M12 9.4v3.9M12 16.9h.01" />
    </>);
}

export function ErrorCircleIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M12 7.9v4.6M12 16.1h.01" />
    </>);
}

export function BlockIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="m6.1 6.1 11.8 11.8" />
    </>);
}

export function HeartIcon(props?: IconProps) {
    return outline(props, <path d="M20.2 6.6a4.7 4.7 0 0 0-6.7 0L12 8.1l-1.5-1.5a4.7 4.7 0 1 0-6.7 6.7l1.5 1.5L12 21.3l6.7-6.7 1.5-1.5a4.7 4.7 0 0 0 0-6.5z" />);
}

/* ---- Identity ---- */

export function PersonIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="8.2" r="3.9" />
        <path d="M4.9 20.4a7.4 7.4 0 0 1 14.2 0" />
    </>);
}

export function AccountIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.6" />
        <circle cx="12" cy="10" r="2.9" />
        <path d="M6.5 18.6a6 6 0 0 1 11 0" />
    </>);
}

export function SecurityIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M12 3.2 5 6.1v5c0 4.3 3 8.3 7 9.4 4-1.1 7-5.1 7-9.4v-5z" />
        <path d="m9.2 11.9 2 2 3.6-3.9" />
    </>);
}

/* ---- Showcase category icons ---- */

export function LayoutIcon(props?: IconProps) {
    return outline(props, <>
        <rect x="3.4" y="3.4" width="7.2" height="7.2" rx="1.4" />
        <rect x="13.4" y="3.4" width="7.2" height="7.2" rx="1.4" />
        <rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.4" />
        <rect x="13.4" y="13.4" width="7.2" height="7.2" rx="1.4" />
    </>);
}

export function ButtonsIcon(props?: IconProps) {
    return outline(props, <>
        <rect x="3.2" y="8.2" width="17.6" height="7.6" rx="2.2" />
        <path d="M8.6 12h6.8" />
    </>);
}

export function InputsIcon(props?: IconProps) {
    return outline(props, <>
        <rect x="3.2" y="7.4" width="17.6" height="9.2" rx="1.8" />
        <path d="M7 10.4v3.2" />
    </>);
}

export function PopupsIcon(props?: IconProps) {
    return outline(props, <>
        <rect x="3.2" y="4.4" width="14" height="11" rx="1.8" />
        <path d="M9 19.6h9.6a2.2 2.2 0 0 0 2.2-2.2V9.4" />
    </>);
}

export function FlyoutsIcon(props?: IconProps) {
    return outline(props, <>
        <rect x="3.2" y="4.4" width="17.6" height="15.2" rx="1.8" />
        <path d="M14.6 4.4v15.2" />
    </>);
}

export function NavigationIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="m15.4 8.6-2 5.4-5.4 2 2-5.4z" />
    </>);
}

export function TabsIcon(props?: IconProps) {
    return outline(props, <>
        <path d="M3.2 9.2h17.6v10.4H3.2z" />
        <path d="M3.2 9.2V5.8a1.4 1.4 0 0 1 1.4-1.4h4.6a1.4 1.4 0 0 1 1.4 1.4v3.4" />
    </>);
}

export function MiscIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="5.6" cy="12" r="1.6" />
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="18.4" cy="12" r="1.6" />
    </>);
}

/* ---- Brand marks ---- kept solid, on purpose. ---- */

export function GitHubIcon(props?: IconProps) {
    return solid(props, <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />);
}

export function YouTubeIcon(props?: IconProps) {
    return solid(props, <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />);
}

export function NpmIcon(props?: IconProps) {
    return solid(props, <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />);
}

export function EmailIcon(props?: IconProps) {
    return outline(props, <>
        <rect x="2.9" y="5.2" width="18.2" height="13.6" rx="2" />
        <path d="m3.4 6.6 8.6 6 8.6-6" />
    </>);
}

export function WebsiteIcon(props?: IconProps) {
    return outline(props, <>
        <circle cx="12" cy="12" r="8.8" />
        <path d="M3.2 12h17.6" />
        <path d="M12 3.2a13.6 13.6 0 0 1 0 17.6 13.6 13.6 0 0 1 0-17.6z" />
    </>);
}
