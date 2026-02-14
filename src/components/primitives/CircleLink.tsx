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
    {...props}
    className={classNames('rounded-full flex justify-center items-center', className)}
  >
    <Icon icon={icon} aria-label={props['aria-label'] ?? title} />
  </a>
)
