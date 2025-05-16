'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
    name: string;
    href: string;
    current?: boolean;
}

export default function Breadcrumb() {
    const pathname = usePathname();

    // Skip if we're on the home page
    if (pathname === '/') return null;

    // Split the path into segments
    const segments = pathname.split('/').filter(Boolean);

    // Create breadcrumb items
    const breadcrumbs: BreadcrumbItem[] = [
        { name: 'Home', href: '/' },
        ...segments.map((segment, index) => ({
            name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            href: `/${segments.slice(0, index + 1).join('/')}`,
            current: index === segments.length - 1,
        })),
    ];

    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.href}>
                        <div className="flex items-center">
                            {index > 0 && (
                                <svg
                                    className="h-5 w-5 text-gray-400 mx-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                </svg>
                            )}
                            <Link
                                href={breadcrumb.href}
                                className={`${breadcrumb.current
                                    ? 'text-gray-800 font-medium'
                                    : 'text-blue-600 hover:text-blue-800'
                                    }`}
                                aria-current={breadcrumb.current ? 'page' : undefined}
                            >
                                {breadcrumb.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
} 