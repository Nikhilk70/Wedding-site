import { dotDate } from '../lib/format.js';
import { ShareButton } from './Effects.jsx';

export default function Footer({ site, names }) {
  return (
    <footer className="footer">
      <div className="ornament" aria-hidden="true"><span>❖</span></div>
      <p className="script footer__names reveal">{names.groom} &amp; {names.bride}</p>
      <p className="footer__date">{dotDate(site.wedding?.date)}</p>
      <p className="footer__thanks" lang="ml">നന്ദി · Thank you for being part of our story</p>
      <div className="footer__share"><ShareButton names={names} /></div>
    </footer>
  );
}
