import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { cn } from '../../../utils/cn'

export const GridCardTitle = ({
  title,
  isOpen,
  onClick,
  id,
}: {
  title: string
  isOpen: boolean
  id: string
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) => (
  <h2 id={id} data-testid="grid-card-title-text">
    <button
      type="button"
      data-testid="grid-card-title"
      className={cn(
        'flex items-center justify-center relative top-0 w-full p-1', // position, layout
        'font-[Roboto_Condensed] bg-[darkslateblue] cursor-pointer rounded-b-2xl', // appearance
        'hover:custom-shadow-[cyan] hover:text-glow-heavy-[darkcyan]', // hover glow
        'max-md:py-2', // mobile
      )}
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className="mx-5 text-center text-2xl font-bold">{title}</span>
      <Icon
        data-testid="grid-card-title-collapse-caret"
        size="lg"
        icon={faCaretDown}
        className={cn(
          'absolute right-4 select-none', // position, appearance
          'transition-transform duration-200 ease-linear', //animation
          isOpen ? 'rotate-180' : 'rotate-360',
        )}
        aria-hidden
      />
    </button>
  </h2>
)
