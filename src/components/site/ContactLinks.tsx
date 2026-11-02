import type { ReactNode } from "react";
import { business } from "@/data/business";
import { trackContact } from "@/lib/tracking";

type P = { className?: string; children?: ReactNode; ariaLabel?: string };

/** Every tel: link goes through this so the Contact event fires. */
export function PhoneLink({ className, children, ariaLabel }: P) {
  return (
    <a
      href={`tel:${business.phoneTel}`}
      className={className}
      onClick={trackContact}
      aria-label={ariaLabel}
    >
      {children ?? business.phoneDisplay}
    </a>
  );
}

/** Every wa.me link goes through this so the Contact event fires. */
export function WhatsAppLink({ className, children, ariaLabel }: P) {
  return (
    <a
      href={business.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={trackContact}
      aria-label={ariaLabel}
    >
      {children ?? "WhatsApp"}
    </a>
  );
}
