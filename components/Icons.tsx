import React from 'react';

export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .135.282l8.108 8.107a.75.75 0 0 0 1.28-.53V3.239a.75.75 0 0 0-1.28-.53L4.341 8.14a.75.75 0 0 0-.135.282L3.105 13.372a.75.75 0 0 0 .826.95l14.433-6.56a.75.75 0 0 0 0-1.38L3.105 2.289Z" />
  </svg>
);

export const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21Z" />
  </svg>
);

export const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.75-5.455c.414-1.293-.01-2.673-1.03-3.468l-4.7-3.76a9.095 9.095 0 0 0-10.94 0l-4.7 3.76c-1.02.795-1.444 2.175-1.03 3.468A9.094 9.094 0 0 0 6 18.72m12 0a9.094 9.094 0 0 1-12 0m12 0a9.094 9.094 0 0 0-12 0M6 18.72A9.095 9.095 0 0 1 12 15.11a9.095 9.095 0 0 1 6 3.61m-12 0a9.094 9.094 0 0 1-3.75-5.455c-.414-1.293.01-2.673 1.03-3.468l4.7-3.76a9.095 9.095 0 0 1 10.94 0l4.7 3.76c1.02.795 1.444 2.175 1.03 3.468A9.094 9.094 0 0 1 18 18.72m-12 0a9.094 9.094 0 0 0 12 0" />
    </svg>
);

export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    {/* Body: A rectangle positioned directly underneath the roof. */}
    <path
        d="M4 11 V 22 H 20 V 11 H 4 Z"
        fill="#c084fc"
    />
    {/* Roof: A solid, thick triangle that overhangs the body. */}
    <path
        d="M12 2 L 1 11 L 23 11 Z"
        fill="#581c87"
    />
  </svg>
);

export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.927 0l-7.5 4.25A.75.75 0 0 0 3 7.354v9.292a.75.75 0 0 0 .537.72l7.5 4.25a.75.75 0 0 0 .927 0l7.5-4.25a.75.75 0 0 0 .537-.72V7.354a.75.75 0 0 0-.537-.72l-7.5-4.25ZM12 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 12 6Zm-1.72 6.72a.75.75 0 1 0-1.06 1.06l1.25 1.25a.75.75 0 0 0 1.06 0l2.25-2.25a.75.75 0 1 0-1.06-1.06L11 14.94l-.72-.72Z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

export const BoldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M15.15,15.65H11.3V18H8.8V15.65H7.5V13.3h1.3V9.85H7.5V7.5h3.65c2.4,0,3.9,1.1,3.9,3.15,0,1.35-.95,2.3-2.3,2.65Zm-3.85-2.3v-3.5h1.6c.95,0,1.5.5,1.5,1.75s-.55,1.75-1.5,1.75Z" />
  </svg>
);

export const ItalicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M15.25,18H12.75l-4-12H11.25l4,12Z" />
  </svg>
);

export const TextColorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.2,16.8,11,12.3,8.8,16.8ZM10.5,6h3L18,18H15.6l-.9-2.2H9.3L8.4,18H6Z" />
  </svg>
);

export const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const ChatBubbleLeftRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.267c-.559.04-.99.467-.99.998v3.033a1.5 1.5 0 0 1-2.43 1.054l-5.234-3.736a1.5 1.5 0 0 0-.917 0l-5.234 3.736a1.5 1.5 0 0 1-2.43-1.054V12.6c0-1.136.847-2.1 1.98-2.193l3.722-.267c.559-.04.99-.467.99-.998V6.033a1.5 1.5 0 0 1 2.43-1.054l5.234 3.736a1.5 1.5 0 0 0 .917 0l5.234-3.736a1.5 1.5 0 0 1 2.43 1.054v1.286c0 .97-.616 1.813-1.5 2.097Z" />
    </svg>
);

export const ShieldExclamationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 1 15 0m-15 0a7.5 7.5 0 0 0 15 0m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5m-15 0H3m18 0h-1.5" />
    </svg>
);

export const ExclamationTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

export const ListBulletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);