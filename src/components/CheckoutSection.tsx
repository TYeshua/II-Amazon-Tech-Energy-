import { Reveal } from './Reveal';

const SYMPLA_URL = 'https://www.sympla.com.br/evento/ii-amazontechenergy/3541991?share_id=copiarlink';
const WHATSAPP_URL = 'https://wa.me/559991480215';

export function CheckoutSection() {
  return (
    <section className="checkout-section" id="inscricao">
      <div className="section-inner">
        <Reveal>
          <header className="checkout-header">
            <p className="kicker">Garanta sua vaga</p>
            <h2>Inscrição</h2>
          </header>
        </Reveal>

        <Reveal delay={100}>
          <div className="glass-panel checkout-sympla-panel">
            <h3 className="panel-title">Inscreva-se pelo Sympla</h3>
            <p className="checkout-sympla-text">
              As inscrições para o Amazon Tech Energy são feitas diretamente na plataforma Sympla.
              Clique no botão abaixo para escolher seu ingresso e efetuar o pagamento com segurança.
            </p>
            <a
              href={SYMPLA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-submit-btn checkout-sympla-btn"
            >
              Inscrever-se no Sympla
            </a>

            <p className="checkout-spe-text">
              Caso você for membro SPE, entre em contato com o número:
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-submit-btn checkout-whatsapp-btn"
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
