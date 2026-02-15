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
    className={classNames(
      'flex items-center justify-center relative top-0 m-2 p-2', //position, layout
      'font-[Roboto_Condensed] rounded-2xl bg-[darkslateblue] cursor-pointer', //appearance
      'hover:shadow-[0_0_10px_2px_cyan] hover:text-glow-[darkcyan]', //hover glow
    )}
    role="button"
    tabIndex={0}
    aria-expanded={isOpen}
    onKeyDown={triggerClick}
    onClick={onClick}
  >
    <h2 id={id} className="mx-5 text-center text-2xl font-bold">
      {title}
    </h2>
    <Icon
      size="lg"
      icon={faCaretDown}
      className={classNames(
        'absolute right-4 select-none', //position, appearance
        'transition-transform duration-200 ease-linear', //animation
        isOpen ? 'rotate-[180deg]' : 'rotate-[360deg]',
      )}
      aria-hidden
    />
  </div>
)
