import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { triggerClick } from '../../../utils/html-utils'

export const GridCardTitle = ({
  title,
  isOpen,
  onClick,
  id,
}: {
  title: string
  isOpen: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
  id: string
}) => (
  // biome-ignore lint/a11y/useSemanticElements: is fine as Div
  <div
    data-testid="grid-card-title"
    className={classNames(
      'flex items-center justify-center relative top-0 p-1', // position, layout
      'font-[Roboto_Condensed] bg-[darkslateblue] cursor-pointer rounded-b-2xl', // appearance
      'hover:custom-shadow-[cyan] hover:text-glow-heavy-[darkcyan]', // hover glow
      'max-md:py-2', // mobile
    )}
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    onKeyDown={triggerClick}
    onClick={onClick}
  >
    <h2
      id={id}
      className="mx-5 text-center text-2xl font-bold"
      data-testid="grid-card-title-text"
    >
      {title}
    </h2>
    <Icon
      data-testid="grid-card-title-collapse-caret"
      size="lg"
      icon={faCaretDown}
      className={classNames(
        'absolute right-4 select-none', // position, appearance
        'transition-transform duration-200 ease-linear', //animation
        isOpen ? 'rotate-180' : 'rotate-360',
      )}
      aria-hidden
    />
  </div>
)
