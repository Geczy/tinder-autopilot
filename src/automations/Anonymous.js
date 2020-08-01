import { insertCss, removeCss } from '../misc/insert-css';

class Anonymous {
  selector = '.tinderAutopilotAnonymous';

  start = () => {
    insertCss(
      `.messageListItem [aria-label],
            .Expand[aria-label] {
                filter: blur(3px);
            }
            
            .profileCard__slider__img,
            .StretchedBox[aria-label] {
                filter: blur(20px);
            }`
    );
  };

  stop = () => {
    removeCss();
  };
}

export default Anonymous;
