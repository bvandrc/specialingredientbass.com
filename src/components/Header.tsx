import {
  faFacebook,
  faInstagram,
  faReddit,
  faSoundcloud,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { CircleLink } from './primitives/CircleLink'

export const Header = () => {
  return (
    <header>
      <div id="header-center">
        <img
          src="/Logo Outlined.svg"
          alt="Special Ingredient Bass Mixes"
          id="header-logo-img"
        />
      </div>
      <div id="header-right">
        <section id="bio" aria-label="bio">
          All forms of bass music 🌀
          <br />
          Tracklist in every mix 🎵
          <br />
          For your bike rides, hikes, walks, and long drives 🙃
          <br />
          Take a journey 🏕️
          <br />
          Denver based 🏔️ from Wisconsin 🧀
          <br />
          AKA DJ Smoothbrain 😉
        </section>
        {/** biome-ignore lint/a11y/useSemanticElements: is fine as Div */}
        <div id="social-links" role="group" aria-label="social links">
          <CircleLink
            className="soundcloud"
            title="SoundCloud"
            icon={faSoundcloud}
            href="https://www.soundcloud.com/special-ingredient"
          />
          <CircleLink
            className="twitter"
            title="Twitter"
            icon={faTwitter}
            href="https://www.twitter.com/dj_smoothbrain"
          />
          <CircleLink
            className="instagram"
            title="Instagram"
            icon={faInstagram}
            href="https://www.instagram.com/special_ingredient_bass"
          />
          <CircleLink
            className="reddit"
            title="Reddit"
            icon={faReddit}
            href="https://www.reddit.com/user/SpecialIngredient"
          />
          <CircleLink
            className="facebook"
            title="Facebook"
            icon={faFacebook}
            href="https://www.facebook.com/profile.php?id=100087612335247"
          />
          <CircleLink
            className="email"
            title="Email"
            icon={faEnvelope}
            onClick={() => {
              const EMAIL = 'SpecialIngredientBass@gmail.com'
              navigator.clipboard.writeText(EMAIL)
              alert(`Copied to clipboard: ${EMAIL}`)
            }}
          />
        </div>
      </div>
    </header>
  )
}
