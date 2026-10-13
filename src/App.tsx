import { Contact } from './components/Contact'
import { Dicas } from './components/Dicas'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeightControl } from './components/HeightControl'
import { MeasureTable } from './components/MeasureTable'
import { ProposalBanner } from './components/ProposalBanner'
import { ScrollRuler } from './components/ScrollRuler'
import { TrackDay } from './components/TrackDay'

export default function App() {
  return (
    <>
      <a
        href="#altura"
        className="sr-only z-50 bg-ink px-4 py-2 font-medium text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <ProposalBanner />
      <div className="relative">
        <ScrollRuler />
        <div className="pl-[calc(var(--ruler-w)+16px)] pr-4 md:pl-[calc(var(--ruler-w)+32px)] md:pr-8">
          <div className="mx-auto max-w-[1240px]">
            <Header />
            <main>
              <HeightControl />
              <MeasureTable />
              <Contact />
              <TrackDay />
              <Dicas />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
