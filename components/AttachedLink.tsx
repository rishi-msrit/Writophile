import { linkLabel as deriveLinkLabel } from '@/lib/frontmatter';

interface AttachedLinkProps {
  link: string;
  label?: string;
}

export default function AttachedLink({ link, label }: AttachedLinkProps) {
  const resolvedLabel = deriveLinkLabel(link, label);

  return (
    <div className="my-4">
      <a
        href={link}
        rel="noopener noreferrer"
        target="_blank"
        className="stamp-btn"
        aria-label={resolvedLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3.5 h-3.5 flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M6.22 8.72a.75.75 0 001.06 1.06l5.22-5.22v1.69a.75.75 0 001.5 0v-3.5a.75.75 0 00-.75-.75h-3.5a.75.75 0 000 1.5h1.69L6.22 8.72z" />
          <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 007 4H4.75A2.75 2.75 0 002 6.75v4.5A2.75 2.75 0 004.75 14h4.5A2.75 2.75 0 0012 11.25V9a.75.75 0 00-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5z" />
        </svg>
        {resolvedLabel}
      </a>
    </div>
  );
}

