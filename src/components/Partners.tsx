import { PARTNERS } from '../constants';

const Partners: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-sm font-bold uppercase tracking-[0.3em] mb-12 text-muted-foreground/60">
          Strategic Partners
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-12 md:gap-x-16 opacity-70">
          {[
            { name: 'Ethereum', logo: '/images/ethereum.svg' },
            { name: 'BNB Chain', logo: '/images/bnb.svg' },
            { name: 'Base', logo: '/images/base.svg' },
            { name: 'Solana', logo: '/images/solana.svg' },
            { name: 'Optimism', logo: '/images/optimism.svg' },
            { name: 'Avalanche', logo: '/images/avalanche.svg' },
            { name: 'Mantle', logo: '/images/mantle.svg' },
            { name: 'ZkLayer', logo: '/images/zklayer.svg' },
            { name: 'Taiko', logo: '/images/taiko.svg' },
          ].map((partner) => (
            <div key={partner.name} className="group cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-110">
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-8 w-auto md:h-10 opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        <style jsx>{`
            img {
                transition: all 0.3s ease;
            }
            .group:hover img {
                filter: brightness(1.5);
            }
        `}</style>
      </div>
    </section>
  );
};

export default Partners;