import {
  FontAwesomeIcon as Icon,
  type FontAwesomeIconProps as IconProps,
} from '@fortawesome/react-fontawesome'

import { cn } from '@/utils'

type CircleLinkProps = Pick<IconProps, 'icon'> &
  React.HTMLAttributes<HTMLElement> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

/** Renders a link when given an `href`, otherwise a button. */
export const CircleLink = ({
  icon,
  className,
  href,
  ...props
}: CircleLinkProps) => {
  const sharedClassName = cn(
    'rounded-full flex justify-center items-center', // make a circle and center the icon
    className
  )
  const inner = <Icon icon={icon} />

  return href !== undefined ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...props}
      className={sharedClassName}>
      {inner}
    </a>
  ) : (
    <button type="button" {...props} className={sharedClassName}>
      {inner}
    </button>
  )
}
