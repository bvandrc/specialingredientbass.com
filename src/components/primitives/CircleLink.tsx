import {
  FontAwesomeIcon as Icon,
  type FontAwesomeIconProps as IconProps,
} from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

export const CircleLink = ({
  icon,
  className,
  title,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & Pick<IconProps, 'icon'>) => (
  <a
    target="_blank"
    tabIndex={0}
    title={title}
    {...props}
    className={classNames(
      'rounded-full flex justify-center items-center', // make a circle and center the icon
      className,
    )}
  >
    <Icon icon={icon} />
  </a>
)
