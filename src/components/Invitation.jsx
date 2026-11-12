import { Nilavilakku } from './Decor.jsx';
import MotionFrame from './MotionFrame.jsx';
const parentName = (p) => (p?.name ? `${p.late ? 'Late ' : ''}${p.name}` : '');

function Parents({ label, father, mother }) {
  const names = [parentName(father), parentName(mother)].filter(Boolean);
  if (!names.length) return null;
  return (
    <p className="family__parents">
      <span className="family__rel">{label}</span>
      {names.join(' & ')}
    </p>
  );
}

export default function Invitation({ site, guest }) {
  const { bride = {}, groom = {} } = site;
  const text = site.invite?.text || 'Together with our families, we joyfully invite you to celebrate our wedding';

  return (
    <section className="section invitation" id="invitation">
      <div className="container narrow">
        <div className="invocation reveal" aria-hidden="true">
          <Nilavilakku size={30} />
          <span className="ganesha">ॐ</span>
          <Nilavilakku size={30} />
        </div>
        <p className="eyebrow reveal">{guest ? `Dear ${guest},` : 'With the blessings of the Almighty'}</p>
        <p className="lead reveal" style={{ '--d': '.1s' }}>{text}</p>

        <MotionFrame src={site.frames?.invitation || site.photos?.main} shape="arch" ratio="4 / 4.4" tilt={0} motion="in" focus="50% 62%" />

        <div className="families">
          <div className="family reveal from-left">
            <h2 className="family__name">{groom.name}</h2>
            <Parents label="Son of" father={groom.father} mother={groom.mother} />
          </div>
          <div className="families__amp script reveal zoom" aria-hidden="true">&amp;</div>
          <div className="family reveal from-right">
            <h2 className="family__name">{bride.name}</h2>
            <Parents label="Daughter of" father={bride.father} mother={bride.mother} />
          </div>
        </div>

        <p className="invitation__ml reveal" lang="ml">
          നിങ്ങളുടെ സാന്നിധ്യവും അനുഗ്രഹവും ഞങ്ങളുടെ വിവാഹത്തിന് ഏറ്റവും വലിയ സമ്മാനമാണ്.
        </p>
      </div>
    </section>
  );
}
