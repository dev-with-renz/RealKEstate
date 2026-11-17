import { useQuote } from "../../context/quote";
import { CONTACT, KRIZA } from "../../data/site";
import Icon from "../ui/Icon";
import KrizaPortrait from "./KrizaPortrait";

/** Soft, light band at the top of the footer: friendly, but smaller than the main sections. */
export default function MeetKriza() {
  const { openQuote } = useQuote();
  const phone = CONTACT.phones[0];

  return (
    <section aria-labelledby="kriza-title" className="mt-8 bg-blush">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[3fr_2fr]">
        <div>
          <p className="chip bg-white text-deca-700">Meet your agent</p>
          <h2 id="kriza-title" className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Meet {KRIZA.name}, your DECA HOMES agent.</h2>
          <p className="mt-3 max-w-xl text-ink-700">{KRIZA.pitch}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => openQuote()}>Message {KRIZA.name}</button>
            <a href={phone.href} className="btn btn-ghost"><Icon name="phone" className="size-5" /> {phone.value}</a>
          </div>
        </div>
        <KrizaPortrait className="mx-auto w-52 sm:w-64 lg:w-full lg:max-w-xs" />
      </div>
    </section>
  );
}
