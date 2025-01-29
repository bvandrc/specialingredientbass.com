import type { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

export const CircleLink = ({
  icon,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & Pick<FontAwesomeIconProps, 'icon'>) => (
  <a
    target="_blank"
    tabIndex={0}
    role="link"
    {...props}
    className={classNames('circle', props['className'])}
    aria-label={props['aria-label'] ?? props['title']}
  >
    <FontAwesomeIcon icon={icon} />
  </a>
)
