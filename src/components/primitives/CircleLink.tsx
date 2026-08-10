import {
  FontAwesomeIcon as Icon,
  type FontAwesomeIconProps as IconProps,
} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

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
  const sharedClassName = classNames(
    'rounded-full flex justify-center items-center', // make a circle and center the icon
    className,
  )
  const inner = <Icon icon={icon} />

  return href !== undefined ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...props}
      className={sharedClassName}
    >
      {inner}
    </a>
  ) : (
    <button type="button" {...props} className={sharedClassName}>
      {inner}
    </button>
  )
}
